const BASE_URL = 'http://127.0.0.1:8080/api';
const isAdmin = true;

const error = document.getElementById('error');
const notifyError = (err) => {
    error.classList.remove("d-none")
    if(!err.description) return error.innerHTML = err.error;
    error.innerHTML = `<p>${err.error}: ${err.description}</p>`
}

// PRODUCTS

async function getProducts () {
  try {
    const response = await axios.get(`${BASE_URL}/productos`);
    if(response.data.error) { notifyError(response.data); return }

    const products = response.data;

    updateProductList(products)
  } catch (errors) {
    console.error(errors);
  }
};

const createCard = prod => {
    const card = document.createElement('div');
    card.className = 'card'
    const cardTitle = document.createElement('div');
    cardTitle.className = 'card-title m-1 p-3'
    cardTitle.innerHTML = `Producto: ${prod.title}`
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body'
    cardBody.innerHTML = `ID: ${prod.id}<br>Descripción: ${prod.description}<br>Precio: ${prod.price}<br>Stock: ${prod.stock}`
    const cardThumbnail = document.createElement('img');
    cardThumbnail.setAttribute('src', `${prod.thumbnail}`)

    card.appendChild(cardThumbnail);
    card.appendChild(cardTitle);
    card.appendChild(cardBody);
  
    return card;
};
  
const updateProductList = products => {
    const productList = document.getElementById('product-list')

    if(productList) {
        if (Array.isArray(products) && products.length > 0) {
        products.map(product => {
            productList.appendChild(createCard(product));
        });
        } else if (products) {
        productList.appendChild(createCard(products));
    }
}}

const productForm = document.getElementById('new-product-form');
if(productForm) {
    if(!isAdmin) productForm.classList.add("d-none")
    productForm.addEventListener('submit', async e => {
      e.preventDefault();
    
      const title = document.getElementById('title').value;
      const price = document.getElementById('price').value;
      const thumbnail = document.getElementById('thumbnail').value;
      const stock = document.getElementById('stock').value;
      const description = document.getElementById('description').value;
    
      const prod = {
        title: title,
        price: price,
        thumbnail: thumbnail,
        stock: stock,
        description: description,
      }
    
      const newItem = await addProduct(prod);
      updateProductList(newItem);
    });
}

const addProduct = async product => {
    try {
        const response = await axios.post(`${BASE_URL}/productos`, product);
        if(response.data.error) { notifyError(response.data); return }
        const newProduct = response.data;
        return newProduct;
    } catch (errors) {
        console.error(errors);
    }
};

// CART 

async function getCart() {
    try {
      const response = await axios.get(`${BASE_URL}/carrito`);
      if(response.data.error) { notifyError(response.data); return }
  
      const products = response.data.products;
  
      updateCartList(products)
    } catch (errors) {
      console.error(errors);
    }
};

const updateCartList = products => {
    const productList = document.getElementById('cart-list')

    if (Array.isArray(products) && products.length > 0) {
    products.map(product => {
        productList.appendChild(createCard(product));
    });
    } else if (products) {
    productList.appendChild(createCard(products));
}}

const cartForm = document.getElementById('add-to-cart');
if(cartForm) {
    cartForm.addEventListener('submit', async e => {
      e.preventDefault();

      prodId = document.getElementById('new-product-id').value
    
      const newItem = await addToCart(prodId);
      console.log(newItem)
      updateCartList(newItem);
    });
}

const addToCart = async prodId => {
    try {
        const response = await axios.post(`${BASE_URL}/carrito/${prodId}`);
        if(response.data.error) { notifyError(response.data); return }
        const newProduct = response.data.products[prodId - 1];
        if(newProduct) error.classList.add("d-none")
        return newProduct;
    } catch (errors) {
        console.error(errors);
    }
};