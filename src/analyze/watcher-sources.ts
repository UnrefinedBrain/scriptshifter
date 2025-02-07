import type { ScriptSetupAst } from '../ast';
import { CompoundWatcherRegex } from './utils';

export function analyzeWatcherSourceTypes(ast: ScriptSetupAst) {
  for (const watcher of ast.watchers) {
    const isCompound = CompoundWatcherRegex.test(watcher.watchName);

    let name = watcher.watchName;
    if (isCompound) {
      const parts = watcher.watchName.split('.');
      name = parts[0]!;
    }

    const isRef = ast.data.some((dataNode) => dataNode.name === name);
    const isProp = ast.props?.some((propNode) => propNode.name === name) ?? false;

    // eslint-disable-next-line default-case
    switch (true) {
      case isCompound && isRef: watcher.sourceType = 'compoundRef'; break;
      case isCompound && isProp: watcher.sourceType = 'compoundProp'; break;
      case !isCompound && isRef: watcher.sourceType = 'ref'; break;
      case !isCompound && isProp: watcher.sourceType = 'prop'; break;
    }
  }
}
