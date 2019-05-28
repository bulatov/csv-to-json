module.exports = class StructureService {
  createObjectByStructureAndRecord(structure, record) {
    const obj = {};
    this._traverseStructureToCreateObject(structure.structure, record.data, obj);
    return obj;
  }

  _traverseStructureToCreateObject(structure, record, obj) {
    for (let key in structure) {
      switch (typeof structure[key]) {
        case 'function':
          obj[key] = structure[key](record);
          break;
        case 'object':
          obj[key] = {};
          this._traverseStructureToCreateObject(structure[key], record, obj[key]);
          break;
        default:
          obj[key] = structure[key];
          break;
      }
    }
  }
}
