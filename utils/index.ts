import fs from 'fs';
import { Iuser } from './type';


export const readData = async (userPath: string): Promise<Iuser> => {
  return JSON.parse(fs.readFileSync(userPath, `utf8`));
}

export const writeData = async (data: any, path: any) => {
  const dataJson = JSON.stringify(data, null, 4);
  fs.writeFile(path, dataJson, (err) => {
    if (err) {
      console.log('Error writing file:', err);
    } else {
      console.log(`wrote file ${path}`);
    }
  });
}
