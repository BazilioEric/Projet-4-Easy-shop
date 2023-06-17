const str = window.location;
const url = new URL(str);
const id = url.searchParams.get("id");
const orderId = document.querySelector("#orderId");
orderId.innerHTML = id;