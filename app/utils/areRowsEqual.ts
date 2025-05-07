// function areRowsEqual(a: any[], b: any[]): boolean {
//   if (a.length !== b.length) return false;

//   for (let i = 0; i < a.length; i++) {
//     const rowA = a[i];
//     const rowB = b[i];

//     // shallow порівняння
//     for (const key in rowA) {
//       if (rowA[key] !== rowB[key]) return false;
//     }
//   }

//   return true;
// }
export function areRowsEqual(a: any[], b: any[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
