import { program } from 'commander';
import { loadParsedFiles, genDiff } from './src/lib.js';

const runApp = () => {
  program
    .description('Compares two configuration files and shows a difference.')
    .version('1.0.0')
    .option('-f, --format [type]', 'output format')
    .argument('<filepath1>')
    .argument('<filepath2>')
    .action((filepath1, filepath2) => {
      try {
        const [file1, file2] = loadParsedFiles(filepath1, filepath2);
        console.log(genDiff(file1, file2));
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
    });
  program.parse(process.argv);
};

export default runApp;
