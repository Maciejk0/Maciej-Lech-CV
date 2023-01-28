/* Checking if the product has the attribute "pa_barwa" and if it does, it hides the alert box. */
var alertbox = jQuery(".alert-warning");
var isBarwa = jQuery('label[for="pa_barwa"]').length;

if (isBarwa == 1) {
      alertbox.hide();

      /* Hiding the second dropdown. */
      jQuery(".single-prod-content .variations tr:nth-child(3) th label").css("display", "none");
      jQuery(".single-prod-content .variations tr:nth-child(3) td select").css("display", "none");

      /* Showing and hiding the alert box. */
      jQuery(document).on('click', '.variations select', function (event) {
            alertbox.fadeIn(500);
            alertbox.show();
      });

      jQuery(document).on('click', '.reset_variations', function (event) {
            alertbox.fadeOut(500);
            alertbox.hide();
      });

      /* Selecting the first available option in the second dropdown. */
      jQuery(document).on('change', '.variations select#kolor', function (event) {

            if (!jQuery(this).val()) return false;
            var select = jQuery(this);
            var variations = jQuery(this).closest('.variations');

            jQuery(variations).find('select#pa_barwa').not(select).each(function () {
                  var val = jQuery(this).val();

                  if (!val || (val && !jQuery(this).find('option[value=' + val + ']:enabled'))) {
                        jQuery(this).find('option:enabled').each(function () {
                              if (jQuery(this).attr('value')) {
                                    jQuery(this).prop('selected', true);
                                    return false;
                              }
                        });
                  }
            });

            jQuery('form.variations_form').trigger('woocommerce_variation_select_change');
            jQuery('form.variations_form').trigger('check_variations');
      });
}