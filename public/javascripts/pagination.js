'use strict';

/**
 * totalPagesOfArray returns the number of pages necesaries to present
 * all the elements of the array data, limited by the dataPerPage value.
 * @param {array} data array of elements
 * @param {integer} dataPerPage number of ads to presente per page
 * @returns integer represents the number of pages necessaries to present all the array
 */
function totalPagesOfArray(data, dataPerPage) {
  if (dataPerPage>0) {return Math.ceil(data.length / dataPerPage);}
  return 1;
}

/**
 * This function returns a sub-array of the data array which contents the elements
 * to present in the page indicate in currentPage. dataPerPage indicates the number
 * of elements and that's used to calculate the elements to present.
 * @param {array} data array of advertisement objects
 * @param {integer} currentPage current elements to present
 * @param {integer} dataPerPage number of ads to present per page
 * @returns array of advertisement objects to present in the number of page indicate
 */
function changePage(data, currentPage, dataPerPage) {
  let dataTemp=[...data];
  let totalPages=totalPagesOfArray(data, dataPerPage);

  let start=0;
  if (currentPage>1) {
    start=(currentPage-1)*dataPerPage;
  }

  let end=data.length;
  if (currentPage<totalPages) {
    end=currentPage*dataPerPage;
  }

  return dataTemp.slice(start,end);
}

/**
 * This function ensure get the previous page of an 
 * elements array.
 * @param {integer} currentPage Current page
 * @param {array} data array of elements to get the page from
 * @param {integer} dataPerPage number of elements to extract
 */
function prevPage(currentPage, data, dataPerPage) {
  if (currentPage>1) {
    currentPage--;
    changePage(data, currentPage, dataPerPage);
  }
}

/**
 * This function ensure get the next page of an
 * elements array.
 * @param {integer} currentPage Current page
 * @param {array} data array of elements to get the page from
 * @param {integer} dataPerPage number of elements to extract
 */
function nextPage(currentPage, data, dataPerPage) {
  if (currentPage<totalPagesOfArray(data, dataPerPage)) {
    currentPage++;
    changePage(data, currentPage, dataPerPage);
  }
}

module.exports={
  totalPagesOfArray,
  changePage,
  prevPage,
  nextPage
}

