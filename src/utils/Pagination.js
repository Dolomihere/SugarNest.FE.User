
const pagination = {
  dataPerPage(arrData, currentPageIndex, totalPerIndex) {
    return arrData.slice((currentPageIndex - 1) * totalPerIndex, currentPageIndex * totalPerIndex);
  },
  totalPage(arrData, totalPerIndex) {
    return Math.ceil(arrData.length / totalPerIndex);
  }
}

export default pagination;
