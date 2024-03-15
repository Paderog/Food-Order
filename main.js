import { Order, Menus, Category } from './functions.js';
import kinds_of_menu from './data.js';

const orders = new Order();
const menus = new Menus(orders);
const categories = new Category(menus);

function init() {
  let filter_wrapper = $('.filter-wrapper');
  filter_wrapper.html(''); //remove the categories
  //create 'all' category
  let all = {
    ID: 'all',
    path: 'utensils',
    title: 'All Menus',
  };
  //create first menu
  filter_wrapper.append(categories.create(all));

  //create the other categories
  for (const iterator in kinds_of_menu) {
    //create the category
    let menu = kinds_of_menu[iterator];
    let filterCard = categories.create({
      title: menu.title,
      ID: menu.ID,
      path: menu.path,
    });
    filter_wrapper.append(filterCard);
    menus.add(menu.items, menu.ID);
  }
  //
  menus.show('all');
  $('.orderbar').toggle(); // hide the order sidebar
}
//iniatileze
init();

//click events

//this is for searching
$('#search').on('keypress', (e) => {
  menus.search($(e.target).val());
});

//this is for confirming orders
$('#total').on('click', (e) => {
  orders.clear();
});

//this is for closing the order sidebar
$('.close').on('click', (e) => {
  $('.orderbar').toggle();
});
//this is for opening the order sidebar
$('#cart').on('click', (e) => {
  $('.orderbar').toggle();
});
