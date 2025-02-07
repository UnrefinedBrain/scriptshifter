/* v8 ignore start */
/* eslint-disable no-console */
import { createVueMetamorphCli } from 'vue-metamorph';
import process from 'process';
import chalk from 'chalk';
import { scriptshifter } from './compile';
import { vueVersions } from './options';

const cli = createVueMetamorphCli({
  plugins: [
    scriptshifter,
  ],
  additionalCliOptions(program) {
    program.option(
      `--vue <${vueVersions.join(' | ')}>`,
      'Output format for vue version',
      (value) => {
        if (!vueVersions.includes(value as never)) {
          // eslint-disable-next-line no-console
          console.error(`Error: --vue option must be one of ${vueVersions.join(', ')}`);
          process.exit(1);
        }

        return value;
      },
      '2.7',
    );
  },

  onProgress({
    done,
    aborted,
    stats,
    filesProcessed,
  }) {
    if (done || aborted) {
      const filesTransformed = Object.values(stats)[0]!;
      console.log(
        `\n  ✨ ${chalk.green('Done!')} Converted ${chalk.cyan(filesTransformed)} of ${chalk.cyan(filesProcessed)} matching files\n`,
      );

      console.log(`  ${chalk.yellow('Tip:')} Run your project's code formatter to fix any ruined formatting.\n`);
    }
  },
});

process.on('SIGQUIT', cli.abort);
process.on('SIGTERM', cli.abort);
process.on('SIGINT', cli.abort);

cli.run();
