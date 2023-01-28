<?php


/**
 * It will display the product attribute taxonomies defined in the array 
 * in the shop and archives pages.
 * 
 * @return The product attribute taxonomy name.
 */
add_action('woocommerce_after_shop_loop_item_title', 'display_shop_loop_product_attributes');
function display_shop_loop_product_attributes()
{
      global $product;

      // Only for simple products
      if (!$product->is_type('variable')) return;

      // Define you product attribute taxonomies in the array
      $product_attribute_taxonomies = array('pa_pojemnosc');
      $attr_output = array(); // Initializing

      // Loop through your defined product attribute taxonomies
      foreach ($product_attribute_taxonomies as $taxonomy) {
            if (taxonomy_exists($taxonomy)) {
                  $label_name = wc_attribute_label($taxonomy, $product);

                  $term_names = $product->get_attribute($taxonomy);

                  if (!empty($term_names)) {
                        $attr_output[] = '<p class="mb-0 ' . $taxonomy . '">' . $label_name . ': ' . $term_names . '</p>';
                  }
            }
      }

      // Output
      echo '<div class="product-attributes">' . implode('<br>', $attr_output) . '</div>';
}


/**
 * It adds a div with a class of info__box after the add to cart button. 
 * 
 * Inside that div, it adds a bolded text of "Liczba metrów kwadratowych do pomalowania:". 
 * 
 * Then it loops through the repeater field and adds a paragraph with the value of the litry field and
 * the value of the mnoznik field multiplied by the litry field. 
 * 
 * Then it adds a small tag with the text of "* przy dwukrotnym malowaniu". 
 * 
 * Then it closes the div.
 */
add_action('woocommerce_after_add_to_cart_form', 'add_content_after_addtocart_button_func');
function add_content_after_addtocart_button_func()
{
      if (have_rows('litraz_farb')) :
            echo '<div class="info__box"><b>Liczba metrów kwadratowych do pomalowania:</b><br>';

            while (have_rows('litraz_farb')) :
                  the_row();

                  $mnoznik = get_sub_field('mnoznik');

                  if ($litry = get_sub_field('litry')) :
                        echo "<p class='mb-5'>" . $litry . "L: " . $litry * $mnoznik . "m<sup>2</sup></p>";
                  endif;

            endwhile;
            echo '<small>* przy dwukrotnym malowaniu</small></div>';
      endif;
}
