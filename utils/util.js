export const getOptionFromProduct = (productList) => {
  const optionList = productList.map(item => {
    return {
      value: item.qrcodeUrl,
      label: item.productName,
      desc: item.codeSegment,
      checked: false
    }
  });

  return optionList
};

