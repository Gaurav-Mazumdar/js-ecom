import { hideLoading, parseRequestUrl, showLoading } from '../utils';
import {getProduct} from '../api'
import Rating from '../components/Rating';

const ProductScreen = {
    after_render: () => {
        const request = parseRequestUrl();
        document.getElementById("add-button").addEventListener('click', () =>{
            document.location.hash = `/cart/${request.id}`
        });
    },

    render: async () => {
        const request = parseRequestUrl();
        showLoading();
        const product = await getProduct(request.id);
        if(product.error){
            return `<div class="err404">${product.error}</div>`
        }
        hideLoading();
        return `
            <div class="content">
                <div class="back-to-result"></div>
                <div class="details">
                    <div class="details-image">
                        <img src="${product.image}" alt="${product.name}"/>
                    </div>
                    <div class="details-info">
                        <ul>
                            <li><h1>${product.name}</h1></li>
                            <li>Price: <strong>₹${product.price}</strong></li>
                            <li>
                                ${Rating.render({
                                    value: product.rating,
                                    text: `${product.numReviews} reviews`
                                })}
                            </li>
                            <li>
                                Category: <strong>${product.category}</strong>
                            </li>
                        </ul>
                    </div>
                    <div class="details-action">
                       <ul>
                            <li>Price: ₹${product.price}</li>
                            <li>
                                Status: ${product.countInStock > 0 
                                ? `<span class="success">In stock</span>` 
                                : `<span class="error">Out of stock</span>`}
                            </li>
                            <li>
                                ${product.countInStock >= 1 ?
                                `<button id="add-button" class="fw primary">Add to Cart</button>` :
                                `<button class="fw disabled">Add to Cart</button>`}
                            </li>
                       </ul>         
                    </div>
                </div>
            </div>
        `
    },
};

export default ProductScreen;