(function($) {
	var ACMG = (function() {

		var $sel = {};
		$sel.window = $(window);
		$sel.html = $("html");
		$sel.body = $("body", $sel.html);

		return {

			slider: function() {
				var self = this,
					$slick = $(".slider-list"),
					$itemSlider = $(".slider-item");

				$slick.slick({
					arrows: true,
					appendArrows: $(".slider-arrow-container"),
					autoplay: true,
					dots: true,
					autoplaySpeed: 10000,
					prevArrow: '<div class="slick-arrow slick-arrow--prev"><svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198 120"><path d="M7.66 65.66l50.91 50.91 5.66-5.66L13.31 60 64.23 9.09l-5.66-5.66L2 60z" fill="#4a4a4a"/><path d="M194.57 64h-184v-8h184z" fill="#4a4a4a"/></svg></div>',
					nextArrow: '<div class="slick-arrow slick-arrow--next"><svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198 120"><path d="M188.91 54.34L138 3.43l-5.66 5.66L183.25 60l-50.91 50.91 5.66 5.66L194.57 60z" fill="#4a4a4a"/><path d="M2 56h184v8H2z" fill="#4a4a4a"/></svg></div>',
					infinite: true,
					speed: 900,
				});

				$itemSlider.on("mousedown", function() {
					item = $(this);
					item.css("cursor", "-webkit-grab");
				});

				$itemSlider.on("mouseup", function() {
					item = $(this);
					item.css("cursor", "pointer");
				});

			},


			forms: {

				init: function($form) {
					var self = this;

					if (!$form) {
						var $form = $sel.body;
					}

					self.applyJcf($form);
					self.mask($form);
					self.validate.init($(".form", $sel.body));
					self.ajaxSelect($form);
				},

				mask: function($form) {
					$("[data-number]", $form).each(function() {
						var $item = $(this);
						$item.mask($item.data("number"));
					});
				},

				applyJcf: function($form) {
					var $selects = $("select", $form),
						$numbers = $("input[type=number]", $form),
						$checkbox = $("input[type=checkbox]", $form),
						$radio = $("input[type=radio]", $form),
						$range = $("input[type=range]", $form);

					$checkbox.each(function() {
						var $item = $(this);
						if ($item.data("jcfapply") !== "off") {
							jcf.replace($item);
						}
					});

					jcf.setOptions("Select", {
						wrapNative: false,
						wrapNativeOnMobile: true,
						multipleCompactStyle: true,
					});

					jcf.setOptions("Number", {
						pressInterval: "150",
						disabledClass: "jcf-disabled",
					});

					jcf.setOptions("Range", {
						orientation: "horizontal",
					});

					$selects.each(function() {
						var $select = $(this),
							selectPlaceholder = $select.attr("placeholder");

						if ($select.data("jcfapply") !== "off") {
							jcf.replace($select);
						}

					});

					$numbers.each(function() {
						var $number = $(this);
						jcf.replace($number);
					});


					$radio.each(function() {
						var $item = $(this);
						jcf.replace($item, "Radio", {
							addClass: $item.data("jcfClass") ? $item.data("jcfClass") : "",
							spanColor: $item.data("jcfSpanColor") ? $item.data("jcfSpanColor") : "",
							spanText: $item.data("jcfSpanText") ? $item.data("jcfSpanText") : "",
							spanImage: $item.data("jcfSpanImage") ? $item.data("jcfSpanImage") : ""
						});
					});

					$range.each(function() {
						var $item = $(this);
						jcf.replace($item);
					});

				},

				validate: {

					init: function($form) {
						var self = this;

						$form.each(function() {
							(function($form) {
								var $formFields = $form.find("[data-error]"),
									formParams = {
										rules: {
										},
										messages: {
										}
									};

								$.validator.addMethod("mobileRU", function(phone_number, element) {
									phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
									return this.optional(element) || phone_number.length > 5 && phone_number.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{6,10}$/);
								}, "Error");

								$formFields.each(function() {
									var $field = $(this),
										fieldPattern = $field.data("pattern"),
										fieldError = $field.data("error");
									if(fieldError) {
										formParams.messages[$field.attr("name")] = $field.data("error");
									} else {
										formParams.messages[$field.attr("name")] = "Ошибка заполнения";
									}
									if(fieldPattern) {
										formParams.rules[$field.attr("name")] = {};
										formParams.rules[$field.attr("name")][fieldPattern] = true;
									}
								});

								if($form.data("success")) {
									formParams.submitHandler = function(form) {
										$.magnificPopup.close();
										event.preventDefault();
										setTimeout(function() {
											$.magnificPopup.open({
												items: {
													src: $form.data("success"),
													type: "ajax",
												},
												tLoading: "Загрузка...",
												closeMarkup: '<button title="%title%" type="button" class="mfp-close btn-container-close"><svg data-name="Слой 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111 111"><path d="M5.86 3.66l101.57 101.57-2.82 2.82L3 6.49z"/><path d="M3 105.23L104.6 3.66l2.82 2.82L5.86 108.05z"/></svg></button>',
												mainClass: "mfp-fade",
												removalDelay: 300,
												closeOnBgClick: false,
												closeBtnInside: true,
												callbacks: {
													open: function() {
														$(".btn-container-close").on("click", function() {
															$.magnificPopup.close();
														});
													},
													ajaxContentAdded: function() {
														DR_DUBKOV_NEW.reload();
														$(".btn-container-close").on("click", function() {
															$.magnificPopup.close();
														});
													},
													parseAjax: function(mfpResponse) {
														mfpResponse.data = $(mfpResponse.data).find("#form-result");
													}
												}

											});
										}, 300)

									};
								}
								$form.validate(formParams);

							})($(this))
						});

					},

				},


				ajaxSelect: function($form) {
					var $selectItems = $form.find("[data-select-item]");

					$selectItems.on("input change", function() {
						var $el = $(this),
							$items = $el.data("selectItem"),
							$container = $($el.data("selectContainer")),
							$url = $el.closest("form").attr("action");

							(function($url, $items, $container) {
								$.ajax({
									url: $url,
									success: function(data) {
										var $data = $('<div />').append(data),
											$itemsNew = $data.find($items);

										$itemsNew.addClass("load-events-item");
										$container.find($items).addClass("hide");

										setTimeout(function() {
											$container.empty();
											$container.append($itemsNew);
										}, 100);

										setTimeout(function() {
											$allElements = $container.find(".load-events-item")
											var $item = 100;

											$allElements.each(function() {
												var $el = $(this);

												setTimeout(function() {
													$el.removeClass("load-events-item");
												}, $item);

												$item = $item + 150;
											})

										}, 300);

									}
								})
							})($url, $items, $container);

					})
				}
			},


			ajaxLoader: function() {
				$sel.body.on("click", ".load-container", function(event) {
					var $linkAddress = $(this),
						href = $linkAddress.attr("href"),
						selector = $linkAddress.data("itemsselector"),
						$container = $($linkAddress.data("container"));

					$linkAddress.addClass("loading");

					(function(href, $container, $link, selector) {
						$.ajax({
							url: href,
							success: function(data) {
								var $data = $('<div />').append(data),
									$items = $data.find(selector),
									$preloader = $data.find(".load");

								$items.addClass("load-events-item");
								$container.append($items);
								$link.parent().remove();

								if($preloader && $preloader.length) {
									$container.parent().append($preloader);
								}

								setTimeout(function() {
									$allElements = $container.find(".load-events-item")
									var $item = 100;
									$allElements.each(function() {
										var $el = $(this);
										setTimeout(function() {
											$el.removeClass("load-events-item");
										}, $item );
										$item = $item+100;
									})
									$linkAddress.removeClass("loading");
								}, 100);

								setTimeout(function() {
									ACMG.reload();
								}, 300);

							}
						})
					})(href, $container, $linkAddress, selector);
					event.preventDefault();
				})
			},


			miniScripts: {

				init: function functionName() {
					var self = this;

					self.showSearch();
					self.catalog.init();
					self.fixedHeader.init();
				},

				fixedHeader: {
					init: function() {
						if ($sel.window.width() > "820") {
							$sel.window.on("scroll", function() {
								var hh = $(".page-header").outerHeight(),
									sTop = $sel.window.scrollTop();
								if(sTop > hh + 50) {
									$sel.body.addClass("fixed-header");
									setTimeout(function() {
										$sel.body.addClass("fixed-header--show");
									}, 100);
								} else {
									$sel.body.removeClass("fixed-header--show");
									$sel.body.removeClass("fixed-header");
								}
							});
						}
					}
				},

				showSearch: function() {
					var self = this,
						$searchButton = $(".button-search");

					$searchButton.on("click", function() {
						var $el = $(this),
							$container = $el.data("search");

						$searchInput = $sel.body.find($container);

						if ($searchInput.hasClass("hide")) {
							$searchInput.removeClass("hide");

							setTimeout(function() {
								$searchInput.removeClass("hide-block");
							}, 300);
						} else {
							$searchInput.addClass("hide-block");

							setTimeout(function() {
								$searchInput.addClass("hide");
							}, 300);
						}

					});

				},

				catalog: {

					init: function() {
						var self = this;

						self.basket();
						self.userpanel();
						self.addToBasket();
						self.closeBasket();
						self.showTooltipRate();
						self.busketNumber();
						self.busketremoveItem();
					},

					basket: function() {
						$(".header-basket", $sel.body).tooltipster({
							content: $("#page-basket"),
							animation: "fade",
							animationDuration: 300,

							contentAsHTML: true,
							arrow: false,
							theme: "page-tooltip",
							side: "bottom",
							interactive: true,
							trigger: "custom",
							triggerOpen: {
								mouseenter: false
							},
							triggerClose: {
								click: true,
								scroll: true
							},
							functionPosition: function(instance, helper, position){
								position.coord.top -= 20;
								position.coord.left -= 20;
								return position;
							}
						});
					},

					userpanel: function() {
						$(".header-userpanel", $sel.body).tooltipster({
							content: $("#page-userpanel"),
							animation: "fade",
							animationDuration: 300,

							contentAsHTML: true,
							arrow: false,
							theme: "page-tooltip",
							side: "bottom",
							interactive: true,
							trigger: "custom",
							triggerOpen: {
								mouseenter: false
							},
							triggerClose: {
								click: true,
								scroll: true
							},
							functionPosition: function(instance, helper, position){
								position.coord.top -= 20;
								position.coord.left -= 20;
								return position;
							}
						});

						$(".header-userpanel").on("click", function(e) {
							e.preventDefault();
							$.magnificPopup.close();
							$(".header-basket", $sel.body).tooltipster("open");
						});
					},

					addToBasket: function() {
						$sel.body.on("submit", ".catalog-form", function(e) {
							e.preventDefault();
							$.magnificPopup.close();
							$(".header-basket", $sel.body).tooltipster("open");
						});
					},

					closeBasket: function() {
						$(".page-basket-close").on("click", function(e) {
							var self = this;
							e.preventDefault();
							$(".header-basket", $sel.body).tooltipster('hide');
						})
					},

					showTooltipRate: function() {
						var self = this,
							$rateSelect = $(".change-rate");

						$(".show-rate", $sel.body).tooltipster({
							content: "",
							contentCloning: true,
							animation: "fade",
							animationDuration: 300,
							contentAsHTML: true,
							arrow: false,
							side: "bottom",
							theme: "tooltip-rate",
							interactive: true,
							trigger: "custom",
							triggerOpen: {
								mouseenter: false
							},
							triggerClose: {
								click: true,
								scroll: true
							}
						});

						$(".show-rate").on("click", function(e) {
							var $el = $(this);
							$($el, $sel.body).tooltipster('content', $($rateSelect.find("option:selected").attr("id"))).tooltipster("open");
							e.preventDefault();
						})
					},

					busketNumber: function() {
						var self = this,
							$number = $(".basket-form").find(".form-item--number");

						$number.on("change", function() {
							var $el = $(this),
								$container = $el.closest(".basket-item"),
								$priceText = $container.find("[data-price]");

							$newPrice = $priceText.data("price") * $el.val();
							$newPrice = String($newPrice);

							$priceText.text($newPrice.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ") + ".–");
						})
					},

					busketremoveItem: function() {
						var self = this,
							$closeButton = $(".basket-form").find(".button-basket-close");

						$closeButton.on("click", function() {
							var $el = $(this),
								$container = $el.closest(".basket-item");

							$container.addClass("hide");

							setTimeout(function() {
								$container.remove();
							}, 300);
						})
					},

				},


			}





		};

	})();

	ACMG.slider();
	ACMG.forms.init();
	ACMG.ajaxLoader();
	ACMG.miniScripts.init();

	ACMG.reload = function() {
	}

})(jQuery);
