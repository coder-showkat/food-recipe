// select element
const categories = document.getElementById('category');
const cart_container = document.getElementById('cart-container');
const btn_showAll = document.getElementById('show-all');
const category_name = document.getElementById('category-name');
const spinner = document.querySelector('.spinner');
const modal_body = document.getElementById('modal-body');


// spinner event
const isLoading = (loading) => {
    if (!loading) {
        spinner.classList.add('hidden');
    } else {
        spinner.classList.remove('hidden');
    }
}

// get data by search
const loadDataBySearch = async (keyword) => {
    const URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;

    try {
        const res = await fetch(URL);
        const data = await res.json();
        return data.meals;
    }

    catch (err) {
        console.error(err);
    }
}

// get filter
const loadFilterCategory = async () => {
    const URL = `https://www.themealdb.com/api/json/v1/1/categories.php`;

    try {
        const res = await fetch(URL);
        const data = await res.json();
        return data.categories;
    }

    catch (err) {
        console.error(err);
    }
}


// get data by category
const loadDataByCategory = async (category) => {
    URL = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    try {
        const res = await fetch(URL);
        const data = await res.json();
        return data.meals;
    }

    catch (err) {
        console.error(err);
    }

}


// get details
const getDetails = async (id) => {
    const URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    try {
        const res = await fetch(URL);
        const data = await res.json();
        return data.meals[0];
    }

    catch (err) {
        console.error(err);
    }
}




// display details
const displayDetails = async (id) => {
    isLoading(true);
    const data = await getDetails(id);
    const ingredients = [];
    for (prop in data) {
        if (prop.includes('strIngredient')){
            if (data[prop]) {
                ingredients.push(data[prop])
            }
        }
    }


    modal_body.innerHTML = `
    <div
    class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
    <h5 class="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
        ${data.strMeal}
    </h5>
    <button type="button"
        class="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
        data-te-modal-dismiss aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="h-6 w-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
</div>
<div class="relative overflow-y-auto p-4">
    <img id="modalImage" src="${data.strMealThumb}"
        class="w-full rounded-md mb-4" alt="">
    <p class="mb-2 font-semibold">Area: <span class="font-normal">${data.strArea}</span></p>
    <p class="mb-2 font-semibold">Category: <span class="font-normal">${data.strCategory}</span></p>
    <p class="mb-2 font-semibold">Ingredients: <span class="font-normal">${ingredients.map(ingredient=>ingredient).join(', ')}.</span>
    </p>
    <p class="mb-2 font-semibold">
        Instructions: <span class="font-normal">${data.strInstructions}</span>
    </p>
    <p class="mb-2 font-semibold">Youtube: <a href="${data.strYoutube}" class="font-normal">${data.strYoutube}</a></p>
</div>
<div
    class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
    <button type="button"
        class="inline-block rounded bg-primary-100 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
        data-te-modal-dismiss data-te-ripple-init data-te-ripple-color="light">
        Close
    </button>
</div>
    `;
    
    isLoading(false);
} 


// display data
const displayData = (data) => {
    cart_container.innerHTML = `
    ${data.map(item => {
        return `
        <div class="block rounded-lg bg-white shadow-lg dark:bg-neutral-700 text-center">
                <div data-te-ripple-init data-te-ripple-color="light">
                    <img class="rounded-t-lg" src="${item.strMealThumb}" alt="" />
                </div>
                <div class="p-6">
                    <h5 class="mb-4 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                        ${item.strMeal}
                    </h5>
                    <button onclick="displayDetails('${item.idMeal}')" type="button"
                        class="inline-block rounded border-2 border-orange px-6 pt-2 pb-[6px] text-xs uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-orange text-orange hover:bg-orange hover:text-blue font-semibold hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                        data-te-ripple-init data-te-ripple-color="light" data-te-toggle="modal"
                        data-te-target="#myModal">
                        SEE DETAILS
                    </button>
                </div>
            </div>
        `
    }).join('')}

    `;
}

// handle display data
const displayDataHandler = (data) => {
    if (!data) {
        cart_container.innerHTML = `
        <div class="text-center absolute left-1/2 -translate-x-1/2 font-semibold text-danger">No result found. Please search different keywords</div>
        `;
        btn_showAll.classList.add('hidden');
        return;
    } else {
    if (data.length >= 12) {
        dataSlice = data.slice(0, 12);
        displayData(dataSlice);
        btn_showAll.classList.remove('hidden');
        btn_showAll.addEventListener('click', ()=>{
            displayData(data);
            btn_showAll.classList.add('hidden');
        })
    } else {
        displayData(data);
        btn_showAll.classList.add('hidden');
    }
    }
}


// create filter list from data
const createFilterList = async () => {
    const data = await loadFilterCategory();

    // console.log(data);
    data.forEach(category => {
        const li = document.createElement('li');
        li.setAttribute('class', 'px-5 py-1 cursor-pointer hover:bg-gray font-thin');
        li.textContent = category.strCategory;
        categories.appendChild(li);
        li.addEventListener('click', async ()=>{

            isLoading(true);
            const dataByCategory = await loadDataByCategory(`${category.strCategory}`);
            displayDataHandler(dataByCategory);
            category_name.textContent = 'Category by ' + category.strCategory;
            isLoading(false);
        })
    })
    
    
}

// search item
const search = document.getElementById('search-field');
const search_input = document.getElementById('input-search');

search.addEventListener('submit', async (e)=>{
    e.preventDefault();
    isLoading(true);
    const data = await loadDataBySearch(`${search_input.value}`);
    displayDataHandler(data);
    isLoading(false);
    search_input.value = '';
})

// window on load
window.onload = async () =>{
    const data = await loadDataBySearch('chi');
    displayDataHandler(data);
    createFilterList();
    isLoading(false);
}
