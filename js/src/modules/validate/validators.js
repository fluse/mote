/**
 * @title  validators
 * @author Holger Schauf
 * @type   module
 * @desc   list of form validators
 * @date   06.2013
 */
var validators = (function ($) {
    return {
        required: function (i, elm) {
            if (elm.attr("type") === "checkbox") {
                return (elm.is(":checked")) ? true : false;
            } else {
                return (elm.val().length > 0);
            }
        },

        minlength: function (min, elm) {
            return (elm.val().length >= min);
        },

        maxlength: function (max, elm) {
            return (elm.val().length <= max);
        },

        match: function (match, elm) {
            return (null !== elm.val().match(match));
        },

        mail: function (elm) {
            var params = {
                email: elm.val()
            };

            $.ajax({
                url: '/ajax/emailcheck.php',
                data: params,
                success: function (data) {
                    var emailError = $('#emailError');
                    if (data.status === 'success') {
                        emailError.hide();
                        return true;
                    }
                    if (data.status === 'failure' && params.email !== '') {
                        elm.parent().find('.icon-ok').hide();
                        elm.parent().addClass('error error-type');
                        emailError.html(js_tr.booking_personal_infos[data.reason]).show();
                        elm.parent().find('.error-message-type').remove();
                        return false;
                    }
                }
            });
            return true;
        },

        creditcard: function (elm) {
            var regEx = "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\\d{3})\\d{11})$";
            return (null !== elm.val().match(regEx));
        },

        driverNameIsCcName: function (elm) {
            if (elm.data("checkname") !== undefined) {
                var driverName = $.trim($('#customerForname').val()) + ' ' + $.trim($('#customerSurname').val());
                return ($.trim(elm.val()) === driverName);
            }
        },

        banknumber: function (elm) {
            var regEx = "[1-9]{1,1}[0-9]{7,7}";
            return (null !== elm.val().match(regEx));
        },

        phoneNumber: function (elm) {
            var regEx = "^([0-9\\s-+\\/]*)$";
            return (null !== elm.val().match(regEx));
        },

        cvcNumber: function (elm) {
            var regEx = "\\d{" + elm.attr("maxlength") + "}";
            return (null !== elm.val().match(regEx));
        },

        age: function (elm, self) {

            var year = null;
            var month = null;
            var day = null;
            // @todo find another way
            self.elm.each(function () {

                if ($(this).data("type") === "year") {
                    year = $(this).val();
                } else if ($(this).data("type") === "month") {
                    month = $(this).val();
                } else if ($(this).data("type") === "day") {
                    day = $(this).val();
                }
            });

            if (day !== null && month !== null && year !== null) {
                var currentDate  = new Date();
                var currentYear  = currentDate.getFullYear();
                var currentMonth = currentDate.getMonth();
                var currentDay   = currentDate.getDate();

                var ageInYears = (currentYear - year);

                if (currentMonth < (month - 1)) {
                    ageInYears--;
                } else if (currentMonth === (month - 1) && currentDay < day) {
                    ageInYears--;
                }

                return (ageInYears > 17);
            } else {
                return false;
            }
        },

        ccDateValid: function () {
            var ccYear   = $("#ccValidYear").val();
            var ccMonth  = $("#ccValidMonth").val();
            var depYear  = personalInfo.year;
            var depMonth = personalInfo.month;
            if (ccYear !== '' && ccMonth !== '') {
               return (parseInt(ccYear.concat(ccMonth)) >= parseInt(depYear.concat(depMonth)));
            } else {
                return false;
            }
        }
    };
})(jQuery);