const responseFormat = (data = null, exceptionType = "Exception", exceptionMessage = "", pagination = null) => {
    let responseObject = new Object();
    responseObject.status = data == null ? 2 : 1;
    responseObject.exceptionType = exceptionType;
    responseObject.exceptionMessage = exceptionMessageConvert(exceptionMessage);
    responseObject.exceptionMessageTechnical = exceptionMessageConvert(exceptionMessage);
    responseObject.data = data;
    responseObject.pagination = pagination;
    return responseObject;
};

const exceptionMessageConvert = (message) => {
    let response = message;
    if (message == "invalid token")
        response = "Yetkiniz Bulunmamaktadır!";
    return response;
};

module.exports = {
    responseFormat
};