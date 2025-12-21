function fetchModel(url) {
  return new Promise(function (resolve, reject) {
    fetch(url, {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => reject(new Error(text)));
        }
        return response.json();
      })
      .then((data) => resolve({ data: data }))
      .catch((err) => reject(new Error(err.message)));
  });
}
export default fetchModel;
