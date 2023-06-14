let objectTemplate = (inputValue) => {
    return {
        name: inputValue,
        quantity: 1,
        isBought: false
    }
}

const productElement = (productObject) => {
    return `<section class="product ${productObject.isBought ? `bought` : ``}">
    <p class="name" onclick="if (!${productObject.isBought}) {this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden'); this.nextElementSibling.focus()}">${productObject.name}</p>
    <input class="name hidden" type="text" name="ProductName" value="${productObject.name}" class="name" onblur="applyRename('${productObject.name}', value, this.previousElementSibling, this);" autofocus/>
    <div  class="secondColumn">
        <button class="minus" ${productObject.quantity == 1 ? `disabled` : ``} data-tooltip="зменшити на 1" onclick="decreaseQuantity('${productObject.name}')">-</button>
        <span class="count">${productObject.quantity}</span>
        <button class="plus" data-tooltip="збільшити на 1" onclick="increaseQuantity('${productObject.name}')">+</button>
    </div>
    
    <div class="thirdColumn">
        <button class="buy" data-tooltip="купити товар" onclick="buyProduct('${productObject.name}')"> ${productObject.isBought ? `Не куплено` : `Куплено`}</button>
        <button class="cancel" data-tooltip="видалити" onclick="deleteProduct('${productObject.name}')">×</button>
    </div>
    </section>`;
}

const countElement = (productObject) => {
    return `<span class="count">${productObject.name}
    <span class="countRight">${productObject.quantity}</span>
    </span>`;
}



let products = [
    { name: "Помідори", quantity: 2, isBought: true },
    { name: "Печиво", quantity: 2, isBought: false },
    { name: "Сир", quantity: 1, isBought: false },
]
function updateLocalStorage() {
    localStorage.setItem("buyList", JSON.stringify(products));


    //console.log(products);
}
function fetchFromLocalStorage() {
    if (localStorage.getItem("buyList") != null) {
        products = JSON.parse(localStorage.getItem("buyList"));
        //console.log("Parsed from localStorage", products);
    }
}
function clearStorage() {
    localStorage.removeItem("buyList");
    location.reload();
}
function findObjectByName(name){
    let productNames = products.map((product) => product.name);
    return products[productNames.indexOf(name)]
}

function increaseQuantity(productName){
    let quantity = findObjectByName(productName).quantity 
    findObjectByName(productName).quantity = quantity+1;
    renderElements();
    renderCountElements();
    updateLocalStorage();
}
function decreaseQuantity(productName){
    let quantity = findObjectByName(productName).quantity 
    if(quantity>1) {
        findObjectByName(productName).quantity = quantity-1;
        renderElements();
        renderCountElements();
        updateLocalStorage();
    }
}

// function applyRename(productName) {
//     console.log("apply rename to", productName);
// }
function deleteProduct(productName) {
    console.log("deleting ", productName);
    let productNames = products.map((product) => product.name);
    let index = productNames.indexOf(productName);
    products.splice(index, 1);
    renderElements();
    renderCountElements();
    updateLocalStorage();
}
function buyProduct(productName) {
    findObjectByName(productName).isBought = !findObjectByName(productName).isBought;
    renderElements();
    renderCountElements();
    updateLocalStorage();
}

function checkValidness(value) {
    let productNames = products.map((product) => product.name.toLocaleLowerCase());
    console.log(productNames);
    if (productNames.includes(value.toLocaleLowerCase().trim()) || value.trim().length == 0) {
        return false;
    } else return true;
}

function renderElements() {
    const productsContainer = document.getElementById("productsList");
    productsContainer.innerHTML = '';
    products.forEach((product) => {
        productsContainer.innerHTML += productElement(product);

    })
}

function renderCountElements() {
    const leftContainer = document.getElementById("left");
    const boughtContainer = document.getElementById("bought");
    leftContainer.innerHTML = '';
    boughtContainer.innerHTML = '';
    products.forEach((product) => {
        if(product.isBought){
            boughtContainer.innerHTML += countElement(product);
        } else {
            leftContainer.innerHTML += countElement(product); 
        }


    })
}

function rename(productName){
    //findObjectByName(productName);
    
}

function applyRename(productName, inputValue, p, input){
    console.log(productName, inputValue, p, input);
    if (checkValidness(inputValue) || productName.toLocaleLowerCase()==inputValue.toLocaleLowerCase()){
        findObjectByName(productName).name = inputValue;
        console.log("product object after renaming:", findObjectByName(inputValue).name);
        p.innerText = inputValue;
        input.value = inputValue;
        input.onblur = () => applyRename(inputValue, input.value, p, input);
        console.log(productName, inputValue, p, input);
        updateLocalStorage();
        renderCountElements();

    } else {
        alert("can't rename to this");
        input.value = findObjectByName(productName).name;
    }
    input.classList.add('hidden'); 
    p.classList.remove('hidden');
}

window.onload = () => {
    if (localStorage.getItem("buyList") == null) {
        updateLocalStorage();
    } else {
        fetchFromLocalStorage();
    }
    renderElements();
    renderCountElements();

    const addProductBtn = document.getElementById("addProductButton");
    const addProductInput = document.getElementById("addProductInput");
    addProductBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let inputValue = addProductInput.value.trim();
        console.log(inputValue);
        if (checkValidness(inputValue)) {
            products.push(objectTemplate(inputValue));
            updateLocalStorage();
            renderElements();
            renderCountElements();

        } else {
            alert("can't add product with this name!")
        }
        addProductInput.value = "";
        addProductInput.focus();
    })

}