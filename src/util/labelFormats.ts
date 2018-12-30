// interface DarknetTrainingData {
//   'train.txt': string;
//   'obj.names': string;
//   'obj.data': string;
// }
// function labelsToDarknet(labels: Label[]): DarknetTrainingData {
//   const classes = Array.from(new Set(labels.map(label => label.str).sort()));
//   const names = classes.join('\n');
//   const data = [
//     `classes = ${classes.length}`,
//     'train = data/train.txt',
//     'valid = data/test.txt',
//     'names = data/obj.names',
//     'backup = backup/'
//   ].join('\n');
// }
