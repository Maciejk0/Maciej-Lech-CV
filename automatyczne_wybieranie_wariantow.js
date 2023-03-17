/* Checking if the product has the attribute "pa_barwa" and if it does, it hides the alert box. */
let alertbox = $(".alert-warning");
let isBarwa = $('label[for="pa_barwa"]').length;

if (isBarwa == 1) {
      alertbox.hide();

      /* Hiding the second dropdown. */
      $(".single-prod-content .variations tr:nth-child(3) th label").css("display", "none");
      $(".single-prod-content .variations tr:nth-child(3) td select").css("display", "none");

      /* Showing and hiding the alert box. */
      $(document).on('click', '.variations select', function (event) {
            alertbox.fadeIn(500);
            alertbox.show();
      });

      $(document).on('click', '.reset_variations', function (event) {
            alertbox.fadeOut(500);
            alertbox.hide();
      });

      /* Selecting the first available option in the second dropdown. */
      $(document).on('change', '.variations select#kolor', function (event) {

            if (!$(this).val()) return false;
            let select = $(this);
            let variations = $(this).closest('.variations');

            $(variations).find('select#pa_barwa').not(select).each(function () {
                  let val = $(this).val();

                  if (!val || (val && !$(this).find('option[value=' + val + ']:enabled'))) {
                        $(this).find('option:enabled').each(function () {
                              if ($(this).attr('value')) {
                                    $(this).prop('selected', true);
                                    return false;
                              }
                        });
                  }
            });

            $('form.variations_form').trigger('woocommerce_variation_select_change');
            $('form.variations_form').trigger('check_variations');
      });
}