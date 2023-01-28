<?php

/**
 * This function returns the category parents of a given category ID
 * 
 * @param id The ID of the category you want to get the parents of.
 * @param link If you want to link to the category, set this to true.
 * @param separator The separator between the categories. Default is '/'.
 * @param nicename If true, the category name will be displayed in its permalink-ized form.
 * @param visited An array of category IDs that have already been added to the chain.
 * @param iscrumb If true, the breadcrumb will be a list of links. If false, it will be a string.
 * 
 * @return a string of the category parents.
 */
function wpse_get_category_parents($id, $link = false, $separator = '/', $nicename = false, $visited = array(), $iscrumb = false)
{
      $chain = '';
      $parent = get_term($id, 'category');
      if (is_wp_error($parent)) {
            return $parent;
      }
      if ($nicename) {
            $name = $parent->slug;
      } else {
            $name = $parent->name;
      }
      if ($parent->parent && ($parent->parent != $parent->term_id) && !in_array($parent->parent, $visited)) {
            $visited[] = $parent->parent;
            $chain .= wpse_get_category_parents($parent->parent, $link, $separator, $nicename, $visited, $iscrumb);
      }
      if (is_rtl()) {
            $sep_direction = '\\';
      } else {
            $sep_direction = '/';
      }
      if ($iscrumb) {
            $chain .= '<li><a class="accessibility-text" href="' . esc_url(get_category_link($parent->term_id)) . '"><span>' . $name . '</span></a></li>' . $separator;
      } elseif ($link && !$iscrumb) {
            $chain .= '<a class="accessibility-text" href="' . esc_url(get_category_link($parent->term_id)) . '">' . $name . '</a>' . $separator;
      } else {
            $chain .=  $name . $separator;
      }
      return $chain;
}

/**
 * It displays the breadcrumbs for the current page.
 */
function wpse_get_breadcrumbs()
{
      global $wp_query;
      if (is_rtl()) {
            $sep_direction = '\\';
      } else {
            $sep_direction = '/';
      } ?>
      <div class="container">
            <nav aria-label="Okruszki" class="jumbotron__breadcrumbs">
                  <ul>
                        <li>
                              <a aria-label="Jesteś tutaj: Strona główna" class="accessibility-text" href="<?php echo esc_url(home_url()); ?>">
                                    <span>Strona główna</span>
                              </a>
                        </li>
                        <?php
                        if (!is_front_page()) {
                              if (is_category()) {
                                    $cat_obj     = $wp_query->get_queried_object();
                                    $thisCat     = get_category($cat_obj->term_id);
                                    $parentCat   = get_category($thisCat->parent);
                                    if ($thisCat->parent != 0) {
                                          $cat_parents = wpse_get_category_parents($parentCat, true, '', false, array(), true);
                                    }
                                    if ($thisCat->parent != 0 && !is_wp_error($cat_parents)) {
                                          echo $cat_parents;
                                    }
                                    echo '<li><a class="accessibility-text" href="' . get_category_link($thisCat) . '"><span>' . single_cat_title('', false) . '</span></a></li>';
                              } elseif (is_archive() && !is_category()) {
                        ?>
                                    <li class="accessibility-text"><?php _e('Archives'); ?></li>
                              <?php
                              } elseif (is_search()) { ?>
                                    <li class="accessibility-text"><?php _e('Search Results'); ?></li>
                              <?php
                              } elseif (is_404()) { ?>
                                    <li class="accessibility-text"><?php _e('404 Not Found'); ?></li>
                              <?php
                              } elseif (is_singular()) {
                                    $category    = get_the_category();
                                    $category_id = get_cat_ID($category[0]->cat_name);
                                    $cat_parents = wpse_get_category_parents($category_id, true, '', false, array(), true);
                                    if (!is_wp_error($cat_parents)) {
                                          echo $cat_parents;
                                    } ?>
                                    <li>
                                          <a class="accessibility-text" aria-current="page" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                    </li><?php
                                    } elseif (is_singular('attachment')) { ?>
                                    <li class="accessibility-text">
                                          <?php the_title(); ?>
                                    </li>
                                    <?php
                                    } elseif (is_page()) {
                                          $post = $wp_query->get_queried_object();
                                          if ($post->post_parent == 0) { ?>
                                          <li class="accessibility-text"><?php the_title(); ?></li>
                                          <?php
                                          } else {
                                                $title = the_title('', '', false);
                                                $ancestors = array_reverse(get_post_ancestors($post->ID));
                                                array_push($ancestors, $post->ID);
                                                foreach ($ancestors as $ancestor) {
                                                      if ($ancestor != end($ancestors)) { ?>
                                                      <li>
                                                            <a class="accessibility-text" href="<?php echo esc_url(get_permalink($ancestor)); ?>"> <span>
                                                                        <?php echo strip_tags(apply_filters('single_post_title', get_the_title($ancestor))); ?></span></a>
                                                      </li>
                                                <?php
                                                      } else { ?>
                                                      <li>
                                                            <?php echo strip_tags(apply_filters('single_post_title', get_the_title($ancestor))); ?>
                                                      </li>
                        <?php
                                                      }
                                                }
                                          }
                                    }
                              }
                        ?>
                  </ul>
            </nav>
      </div>
<?php
}


/**
 * This function is used to display the breadcrumbs on the site
 */
function dotspice_wcag_breadcrumb()
{
      wpse_get_breadcrumbs();
}
add_shortcode('dotspice_wcag_breadcrumb', 'dotspice_wcag_breadcrumb');



/* The class is a walker that adds ARIA attributes to the menu items 
      It adds aria-expanded and aria-hidden attributes to the sub-menu ul. */
class Aria_Walker_Nav_Menu extends Walker_Nav_Menu
{
      public $tree_type = array('post_type', 'taxonomy', 'custom');


      public $db_fields = array('parent' => 'menu_item_parent', 'id' => 'db_id');


      public function start_lvl(&$output, $depth = 0, $args = array())
      {
            $indent = str_repeat("\t", $depth);
            $output .= "\n$indent<ul class=\"sub-menu\" role=\"menu\" aria-expanded=\"false\" aria-hidden=\"true\">\n";
      }


      public function end_lvl(&$output, $depth = 0, $args = array())
      {
            $indent = str_repeat("\t", $depth);
            $output .= "$indent</ul>\n";
      }


      public function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0)
      {
            $indent = ($depth) ? str_repeat("\t", $depth) : '';

            $classes = empty($item->classes) ? array() : (array) $item->classes;
            $classes[] = 'menu-item-' . $item->ID;


            $args = apply_filters('nav_menu_item_args', $args, $item, $depth);

            $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));
            $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';

            $id = apply_filters('nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth);
            $id = $id ? ' id="' . esc_attr($id) . '"' : '';

            $output .= $indent . '<li' . $id . $class_names . ' role="none">';

            $atts = array();
            $atts['title']  = !empty($item->attr_title) ? $item->attr_title : '';
            $atts['target'] = !empty($item->target)     ? $item->target     : '';
            $atts['rel']    = !empty($item->xfn)        ? $item->xfn        : '';
            $atts['href']   = !empty($item->url)        ? $item->url        : '';


            $atts = apply_filters('nav_menu_link_attributes', $atts, $item, $args, $depth);

            $attributes = '';
            foreach ($atts as $attr => $value) {
                  if (!empty($value)) {
                        $value = ('href' === $attr) ? esc_url($value) : esc_attr($value);
                        $attributes .= ' ' . $attr . '="' . $value . '"';
                  }
            }

            $item_output = $args->before;
            $item_output .= '<a' . $attributes . ' role="menuitem">';
            $item_output .= $args->link_before . $item->title . $args->link_after;
            $item_output .= '</a>';
            $item_output .= $args->after;

            $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
      }


      public function end_el(&$output, $item, $depth = 0, $args = array())
      {
            $output .= "</li>\n";
      }
}
