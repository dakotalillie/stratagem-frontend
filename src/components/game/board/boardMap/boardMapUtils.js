function determineClass(abbreviation, territoriesList) {
  if (territoriesList[abbreviation] != null) {
    return territoriesList[abbreviation];
  } else {
    return '';
  }
}
