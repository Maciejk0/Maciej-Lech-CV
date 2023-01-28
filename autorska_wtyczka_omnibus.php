<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @since      1.0.0
 *
 * @package    Omnibus_Price_Oh
 * @subpackage Omnibus_Price_Oh/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Omnibus_Price_Oh
 * @subpackage Omnibus_Price_Oh/public
 */
class Omnibus_Price_Oh_Public
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	function display_lowest_price()
	{
		$options = get_option($this->plugin_name);

		$days_back = (isset($options['wc_lowest_price_days']) && !empty($options['wc_lowest_price_days'])) ? esc_attr($options['wc_lowest_price_days']) : 30;
		$display_date = (isset($options['wc_lowest_price_display_date']) && !empty($options['wc_lowest_price_display_date'])) ? 1 : 0;

		$date_range = date('Y-m-d', strtotime('-' . $days_back . ' days')) . '...' . date('Y-m-d');

		$product_id = get_the_ID();

		// Check if product has variations
		$variations = get_posts(array(
			'post_parent' => $product_id,
			'post_type'   => 'product_variation',
			'posts_per_page' => -1
		));

		if (empty($variations)) {
			$orders = wc_get_orders(array(
				'limit' => -1,
				'status' => 'completed',
				'date_created' => $date_range,
				'product_includes' => array($product_id)
			));

			$prices = array();

			if (isset($orders)) {
				foreach ($orders as $order) {
					$items = $order->get_items();
					foreach ($items as $item) {
						if ($item['product_id'] == $product_id) {
							$prices[] = $item['line_total'];
							$lowest_price_date = $order->get_date_created()->date('m-d-Y');
						}
					}
				}

				$current_price = get_post_meta($product_id, '_price', true);
				if (!empty($prices)) {
					$lowest_price = min($prices);
				}

				if (!empty($current_price) && $current_price < $lowest_price || $current_price == $lowest_price) {
					echo '<p class="lowest-price-text">Aktualna cena produktu jest najniższa</p>';
				} elseif (!empty($prices)) {
					if ($display_date == 1) {
						echo '<p class="lowest-price-text">Najniższa cena przed obniżką z ostatnich ' . $days_back . ' dni: <span class="lowest-price">' . wc_price($lowest_price) . '</span>, Z dnia: <span class="lowest-price">' . $lowest_price_date . '</span></p>';
					} else {
						echo '<p class="lowest-price-text">Najniższa cena przed obniżką z ostatnich ' . $days_back . ' dni: <span class="lowest-price">' . wc_price($lowest_price) . '</span></p>';
					}
				} else {
					echo '<p class="lowest-price-text">Brak danych o niższych cenach produktu w ostatnich ' . $days_back . ' dniach</p>';
				}
			}
		}
	}

	// Display the lowest price on the product page
	function wc_display_variation_lowest_price()
	{
		global $product;
		if ($product->is_type('variable')) {
			echo '<p class="lowest-price-text"></p>';
		}
	}

	function wc_get_variation_lowest_price()
	{
		$options = get_option($this->plugin_name);
		$days_back = (isset($options['wc_lowest_price_days']) && !empty($options['wc_lowest_price_days'])) ? esc_attr($options['wc_lowest_price_days']) : 30;
		$display_date = (isset($options['wc_lowest_price_display_date']) && !empty($options['wc_lowest_price_display_date'])) ? 1 : 0;
		$date_range = date('Y-m-d', strtotime('-' . $days_back . ' days')) . '...' . date('Y-m-d');
		$product_id = get_the_ID();

		// Check if product has variations
		$variations = get_posts(array(
			'post_parent' => $product_id,
			'post_type'   => 'product_variation',
			'posts_per_page' => -1
		));

		if (!empty($variations)) {
			// Loop through variations and find lowest price for each variation
			$variation_id = intval($_POST['variation_id']);
			$prices[$variation_id] = array();

			$orders = wc_get_orders(array(
				'limit' => -1,
				'status' => 'completed',
				'date_created' => $date_range,
				'product_includes' => array($variation_id)
			));

			if (isset($orders)) {
				foreach ($orders as $order) {
					$items = $order->get_items();
					foreach ($items as $item) {
						if ($item['variation_id'] == $variation_id) {
							$prices[$variation_id][] = $item['line_total'];
							$lowest_price_date = $order->get_date_created()->date('m-d-Y');
						}
					}
				}

				$current_price = get_post_meta($variation_id, '_price', true);

				if (!empty($current_price) && $current_price < min($prices[$variation_id]) || $current_price == min($prices[$variation_id])) {
					echo 'Aktualna cena wariantu jest <b>najniższa</b>';
				} elseif (!empty(min($prices[$variation_id]))) {
					if ($display_date == 1) {
						echo 'Najniższa cena przed obniżką z ostatnich ' . $days_back . ' dni: <span class="lowest-price">' . wc_price(min($prices[$variation_id])) . '</span>, Z dnia: <span class="lowest-price">' . $lowest_price_date . '</span>';
					} else {
						echo 'Najniższa cena przed obniżką z ostatnich ' . $days_back . ' dni: <span class="lowest-price">' . wc_price(min($prices[$variation_id])) . '</span>';
					}
				} else {
					echo 'Brak danych o niższych cenach wariantu w ostatnich ' . $days_back . ' dniach';
				}
			}
		}

		wp_die();
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Omnibus_Price_Oh_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Omnibus_Price_Oh_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/omnibus-price-oh-public.css', array(), $this->version, 'all');
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Omnibus_Price_Oh_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Omnibus_Price_Oh_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/omnibus-price-oh-public.js', array('jquery'), $this->version, false);

		wp_enqueue_script('wc-variation-lowest-price', plugin_dir_url(__FILE__) . 'js/wc-variation-lowest-price.js', array('jquery'), $this->version, false);
		wp_localize_script('wc-variation-lowest-price', 'wc_variation_lowest_price', array(
			'ajax_url' => admin_url('admin-ajax.php')
		));
	}
}
