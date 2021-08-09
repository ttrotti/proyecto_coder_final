const BASE_URL = 'http://127.0.0.1:8080';
const isAdmin = true;
const user = window.localStorage.username
console.log(user)


// CHECK IF LOGGED
const isSignup = (window.location.href == `${BASE_URL}/signup.html`)
const isLogin = (window.location.href == `${BASE_URL}/login.html`)
if(!window.localStorage.username && (!isSignup && !isLogin)) {
  window.location.href = 'signup.html'
}

// ERRORS
const error = document.getElementById('error');
const notifyError = (err) => {
    error.classList.remove("d-none")
    if(!err.description) return error.innerHTML = err.error;
    error.innerHTML = `<p>${err.error}: ${err.description}</p>`
}

// Notifications
const successAlert = document.getElementById('success');
const notify = (message) => {
    successAlert.classList.remove("d-none")
    if(!message.description) return successAlert.innerHTML = message.message;
    successAlert.innerHTML = `<p>${message.message}: ${message.description}</p>`
}
// CARDS
const createCard = prod => {
  const card = document.createElement('div');
  card.className = 'card'
  const cardTitle = document.createElement('div');
  cardTitle.className = 'card-title m-1 p-3'
  cardTitle.innerHTML = `Producto: ${prod.title}`
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body'
  cardBody.innerHTML = `Código: ${prod.code}<br>Descripción: ${prod.description}<br>Precio: ${prod.price}<br>Stock: ${prod.stock}`
  const cardThumbnail = document.createElement('img');
  cardThumbnail.setAttribute('src', `${prod.thumbnail}`)

  card.appendChild(cardThumbnail);
  card.appendChild(cardTitle);
  card.appendChild(cardBody);

  return card;
};

// PRODUCTOS

async function getProducts () {
  try {
    const response = await axios.get(`${BASE_URL}/api/productos`);
    if(response.data.error) { notifyError(response.data); return }

    const products = response.data;

    updateProductList(products)
  } catch (errors) {
    console.error(errors);
  }
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
      const code = document.getElementById('code').value;
    
      const prod = {
        title: title,
        price: price,
        thumbnail: thumbnail,
        stock: stock,
        description: description,
        code: code,
      }
    
      const newItem = await addProduct(prod);
      updateProductList(newItem);
    });
}

const addProduct = async product => {
    try {
        const response = await axios.post(`${BASE_URL}/api/productos`, product);
        if(response.data.error) { notifyError(response.data); return }
        const newProduct = response.data;
        return newProduct;
    } catch (errors) {
        console.error(errors);
    }
};

// CARRITO 
async function getCart() {
    try {
      const response = await axios.get(`${BASE_URL}/api/carrito/?owner=${user}`);
      if(response.data.error) { notifyError(response.data); return }
      if(response.data[0].owner != user) {notifyError("Ups, parece que le querías revisar el carrito a unx amigx."); return }
      const products = response.data[0].products;
  
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
      if(!newItem) return
      updateCartList(newItem);
    });
}

const addToCart = async prodId => {
    try {
        const response = await axios.post(`${BASE_URL}/api/carrito/${prodId}`);
        if(response.data.error) { notifyError(response.data); return }
        const newProduct = response.data[0].products[0];
        if(newProduct) error.classList.add("d-none")
        return newProduct;
    } catch (errors) {
        console.error(errors);
    }
};

const placeOrderButton = document.getElementById('place-order-button');
if(placeOrderButton) {
  placeOrderButton.addEventListener('click', async e => {
    e.preventDefault();
    const r = await placeOrder();
    return r
  })
}

const placeOrder = async () => {
  try {
    console.log('sending order...')
    console.log(window.localStorage.username)
    const response = await axios.post(`${BASE_URL}/api/carrito/place-order`, window.localStorage.username);
    if(response.data.error) { notifyError(response.data); return }
    if(response.data[0].cart) { window.location.reload; notify('Tu pedido se ha realizado con éxito. En breve recibirás un email')}

  } catch {
    console.error(errors)
  }
}

// USUARIOS 
// // SIGN UP // //
const signUpForm = document.getElementById('sign-up-form');
if(signUpForm) {
    signUpForm.addEventListener('submit', async e => {
      e.preventDefault();

      username = document.getElementById('username').value
      firstName = document.getElementById('firstName').value
      lastName = document.getElementById('lastName').value
      email = document.getElementById('email').value
      password = document.getElementById('password').value
      age = document.getElementById('age').value
      adress = document.getElementById('adress').value
      telephone = document.getElementById('telephone').value

      if(!username || !firstName || !lastName || !email || !password || !age || !adress || !telephone) {
        notifyError({error: 'Todos los campos son obligatorios'})
        return
      }

      const user = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        age: age,
        adress: adress,
        telephone: telephone,
      }
    
      const newUser = await registerUser(user);
      if(!newUser) { notifyError({error: 'algo salió mal'}); return }
      window.localStorage.setItem('username', `${user.username}`);
      window.location.href = 'home.html'
    });
}

const registerUser = async user => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, user);
    if(response.data.error) { notifyError(response.data); return }
    return response.data
  } catch (errors) {
      console.error(errors);
  }
};

// // LOGOUT // //
const logoutButton = document.getElementById('logout');
if(logoutButton) {
  logoutButton.addEventListener('click', async e => {
    e.preventDefault();
    return logout();
  })
}
const logout = async () => {
  try {
    window.localStorage.clear()
    window.location.href = 'signup.html'
  } catch(err) {
    console.error(err)
  }
}