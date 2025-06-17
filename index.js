import { Command } from 'commander';
import { loadParsedFiles, genDiff } from './src/lib.js';

const runApp = (argv = process.argv) => {
  const program = new Command();
  program
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0')
    .option('-f, --format [type]', 'output format', 'stylish')
    .argument('<filepath1>')
    .argument('<filepath2>')
    .action((filepath1, filepath2, options) => {
      try {
        const { format } = options;
        const [file1, file2] = loadParsedFiles(filepath1, filepath2);
        console.log(genDiff(file1, file2, format));
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
    });

  try {
    const argvArray = Array.isArray(argv) ? argv : ['node', 'gendiff', ...argv.split(' ')];

    program.parse(argvArray);
  } catch (error) {
    if (error.code === 'commander.missingArgument') {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
};

export default runApp;
