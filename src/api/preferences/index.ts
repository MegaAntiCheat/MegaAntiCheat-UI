function setSetting(
  key: string,
  value: string | number | unknown | object,
): void {
  console.log(key, value);
}

function getAllSettings() {
  console.log('TODO');
}

export { setSetting, getAllSettings };
