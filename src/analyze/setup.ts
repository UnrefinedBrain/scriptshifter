import {
  namedTypes as n,
  builders as b,
  type Kinds,
  traverseScriptAST,
} from 'vue-metamorph';
import { isPattern } from './utils';

const REF_PRODUCING_FUNCTIONS = new Set([
  'ref', 'shallowRef', 'computed', 'customRef', 'toRef',
]);

function isRefProducingCall(node: Kinds.ExpressionKind): boolean {
  return node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && REF_PRODUCING_FUNCTIONS.has(node.callee.name);
}

function findVarInit(
  statements: Kinds.StatementKind[],
  varName: string,
): Kinds.ExpressionKind | null {
  for (const stmt of statements) {
    if (stmt.type !== 'VariableDeclaration') continue;
    for (const decl of stmt.declarations) {
      if (decl.type === 'VariableDeclarator'
        && decl.id.type === 'Identifier'
        && decl.id.name === varName
        && decl.init) {
        return decl.init;
      }
    }
  }
  return null;
}

export function analyzeSetup(setup: n.ArrowFunctionExpression): {
  statements: Kinds.StatementKind[];
  names: Record<string, 'ref' | 'raw'>;
} {
  if (setup.body.type !== 'BlockStatement') {
    return {
      statements: [],
      names: {},
    };
  }
  const statements: Kinds.StatementKind[] = setup.body.body
    .filter((stmt) => stmt.type !== 'ReturnStatement');

  const returnStatement = setup.body.body.find((stmt) => stmt.type === 'ReturnStatement');

  if (!returnStatement || returnStatement.argument?.type !== 'ObjectExpression') {
    return {
      statements: [],
      names: {},
    };
  }

  const names: Record<string, 'ref' | 'raw'> = {};

  for (const prop of returnStatement.argument.properties) {
    if (prop.type === 'Property') {
      if (prop.key.type === 'Identifier'
        && prop.value.type === 'Identifier'
        && prop.key.name === prop.value.name
      ) {
        const init = findVarInit(statements, prop.value.name);
        names[prop.key.name] = init && isRefProducingCall(init) ? 'ref' : 'raw';
        // case 1: not creating a new variable in the return body
        continue;
      }

      if (prop.key.type === 'Identifier'
          && !isPattern(prop.value)) {
        // case 2: setup return defines a property that isn't a variable itself
        statements.push(
          b.variableDeclaration(
            'const',
            [
              b.variableDeclarator(
                prop.key,
                prop.value,
              ),
            ],
          ),
        );

        names[prop.key.name] = isRefProducingCall(prop.value) ? 'ref' : 'raw';
      }
    }

    if (prop.type === 'SpreadElement' && prop.argument.type === 'Identifier') {
      // case 3: spread in return value. we cannot spread variable declarations so this requires manual fix

      const decl = b.variableDeclaration(
        'const',
        [
          b.variableDeclarator(
            b.identifier(`FIX_ME_SPREAD_${prop.argument.name}`),
            prop.argument,
          ),
        ],
      );

      decl.comments = [
        b.commentLine(` ⚠️ scriptshifter: Could not analyze which variables were created from spreading '${prop.argument.name}' in the setup() return statement`),
      ];
      statements.push(
        decl,
      );
    }
  }

  return {
    statements,
    names,
  };
}

export function analyzeSetupPropsReferenced(setup: n.ArrowFunctionExpression) {
  if (setup.params[0]?.type !== 'Identifier') {
    return false;
  }

  const propsName = setup.params[0].name;

  let ret = false;
  traverseScriptAST(setup.body, {
    visitIdentifier(path) {
      if (path.node.name === propsName
        && !(n.MemberExpression.check(path.parent.node)
          && path.parent.node.property.type === 'Identifier'
          && path.parent.node.property.name === propsName)) {
        ret = true;
      }

      this.traverse(path);
    },
  });

  return ret;
}
