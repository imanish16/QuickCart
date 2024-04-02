const currentUrl = window.location.origin;

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

// Products datatable
var productstable = $('#example').DataTable({
    ajax: {
        url: url('products'),
        dataSrc: '',
    },
    columns: [
        {
            data: 'id',
            render: function (data, type, row, meta) {
                return meta.row + 1;
            }
        },
        {
            data: 'image_url',
            render: function (data, type, row) {
                return '<img src="https://picsum.photos/200/300" alt="Product Image" style="max-width: 100px; max-height: 100px;">';
            },

        },
        { data: 'name' },
        { data: 'description' },
        {
            data: 'price',
            className: 'price'
        },
        {
            data: 'quantity',
            render: function (data, type, row) {
                return '<input type="number"  class="form-control quantity-input" min="1" max="' + data + '" value="1">';
            }
        },
        {
            data: 'actions',
            render: function (data, type, row) {
                var actionsHtml = '<div class="btn-group" role="group" aria-label="Product Actions">' +
                    '<a href="' + data.addToCart + '" data-product="' + data.id + '" class="btn btn-primary btn-sm btn-add-to-cart"><span>Add To Cart</span></a>' +
                    '<a href="' + data.buy + '" class="btn btn-success btn-sm" disable title="not available" style="cursor:not-allowed"><span>Buy</span></a>' +
                    '</div>';
                // Add more actions as needed
                return actionsHtml;
            }
        }
    ],
    order: [[0, 'asc']],
    paging: true,
    pageLength: 10,
    ordering: true,
    info: false,
    filter: false,
    searching: true,
    select: {
        style: 'os',
        selector: 'td:first-child'
    }
});

var cartstable = $('#cart').DataTable({
    ajax: {
        url: url('cart-list', false),
        dataSrc: '',
    },
    columns: [
        {
            data: 'id',
            render: function (data, type, row, meta) {
                return meta.row + 1;
            }
        },
        {
            data: 'image_url',
            render: function (data, type, row) {
                return '<img src="https://picsum.photos/200/300" alt="Product Image" style="max-width: 100px; max-height: 100px;">';
            },

        },
        { data: 'product_name' },
        {
            data: 'price',
            className: 'price'
        },
        {
            data: 'quantity',
            className: 'quantity'
        },
        {
            data: 'actions',
            render: function (data, type, row) {
                var actionsHtml = '<div class="btn-group" role="group" aria-label="Product Actions">' +
                    '<a href="' + data.drop + '" data-id="' + data.id + '" class="btn btn-danger btn-sm btn-drop-from-cart"><span>Drop</span></a>' +
                    '</div>';
                return actionsHtml;
            }
        }
    ],
    order: [[0, 'asc']],
    paging: true,
    pageLength: 10,
    ordering: true,
    info: false,
    filter: false,
    searching: true,
    select: {
        style: 'os',
        selector: 'td:first-child'
    }
});


function format(d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="width:100%;">' +
        '<tr class="expanded-row">' +
        '<td colspan="8" class="row-bg"><div><div class="d-flex justify-content-between"><div class="cell-hilighted"><div class="d-flex mb-2"><div class="mr-2 min-width-cell"><p>Policy start date</p><h6>25/04/2020</h6></div><div class="min-width-cell"><p>Policy end date</p><h6>24/04/2021</h6></div></div><div class="d-flex"><div class="mr-2 min-width-cell"><p>Sum insured</p><h5>$26,000</h5></div><div class="min-width-cell"><p>Premium</p><h5>$1200</h5></div></div></div><div class="expanded-table-normal-cell"><div class="mr-2 mb-4"><p>Quote no.</p><h6>Incs234</h6></div><div class="mr-2"><p>Vehicle Reg. No.</p><h6>KL-65-A-7004</h6></div></div><div class="expanded-table-normal-cell"><div class="mr-2 mb-4"><p>Policy number</p><h6>Incsq123456</h6></div><div class="mr-2"><p>Policy number</p><h6>Incsq123456</h6></div></div><div class="expanded-table-normal-cell"><div class="mr-2 mb-3 d-flex"><div class="highlighted-alpha"> A</div><div><p>Agent / Broker</p><h6>Abcd Enterprices</h6></div></div><div class="mr-2 d-flex"> <img src="../../images/faces/face5.jpg" alt="profile"/><div><p>Policy holder Name & ID Number</p><h6>Phillip Harris / 1234567</h6></div></div></div><div class="expanded-table-normal-cell"><div class="mr-2 mb-4"><p>Branch</p><h6>Koramangala, Bangalore</h6></div></div><div class="expanded-table-normal-cell"><div class="mr-2 mb-4"><p>Channel</p><h6>Online</h6></div></div></div></div></td>'
    '</tr>' +
        '</table>';
}

function url(path, api = true) {
    let pathname = '';
    if (api) {
        pathname = '/api/' + path
    } else {
        pathname = '/' + path
    }
    return currentUrl + pathname;
}

$(document).ready(function () {

    $('#example').on('click', '.btn-add-to-cart', function (e) {
        e.preventDefault();
        var $button = $(this);
        var productId = $(this).data('product');
        var quantity = $(this).closest('tr').find('.quantity-input').val();
        $.ajax({
            url: url('add-cart', false),
            method: 'POST',
            data: {
                productId: productId,
                quantity: quantity
            },
            success: function (response) {
                toastr.success('Product added to cart successfully');
            },
            error: function (xhr, status, error) {
                toastr.error('Error adding product to cart:', error);
            }
        });
    });

    var flag = true;
    var trueprice = 0;
    $('#example').on('change', '.quantity-input', function () {
        var quantity = parseInt($(this).closest('tr').find('.quantity-input').val());
        console.log(quantity);
        var price = parseFloat($(this).closest('tr').find('.price').text().replace('$', ''));
        console.log(price);
        if (flag) {
            trueprice = price;
            flag = false;
        }
        // Calculate the new total price
        var totalPrice = quantity * trueprice;
        console.log(totalPrice);
        // Update the total price cell
        $(this).closest('tr').find('.price').text('$' + totalPrice.toFixed(2));
    });

    $('#cart').on('click', '.btn-drop-from-cart', function (e) {
        e.preventDefault();
        var price = parseFloat($(this).closest('tr').find('.price').text().replace('$', '').trim());
        console.log(price);
        var grandTotal = parseFloat($('#grandTotal').text());
        console.log("Parsed price:", grandTotal);
        var newGrandTotal = Math.abs(grandTotal - price);
        console.log("New grand total:", newGrandTotal);

        $('#grandTotal').html(newGrandTotal.toFixed(2));

        var itemId = $(this).data('id');

        $.ajax({
            url: url('remove-cart', false),
            method: 'Post',
            data: {
                id: itemId,
            },
            success: function (response) {
                cartstable.ajax.reload();
                toastr.success('Item dropped from cart successfully');
            },
            error: function (xhr, status, error) {
n                  toastr.error('Error dropping item from cart: ' + error);
            }
        });
    });

});