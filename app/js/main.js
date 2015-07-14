var indentSetting = '\t';

$(function() {


    $('#modules article')

        .not('.add-new')

        .draggable({
            scroll: false,
            helper: 'clone',
            appendTo: document.body,
            connectToSortable: 'main'
        });


    $('main')

        .droppable({
            accept: 'article:not(.ui-sortable-helper, .var)'
        })

        .sortable({
            items: 'article',
            placeholder: 'placeholder',
            stop: function( event, ui ) {
                if($(ui.item[0]).children('menu').size() == 0){
                    $(ui.item[0])
                        .removeAttr('style')
                        .append('<menu><i class="fa fa-fw fa-cog"></i><i class="fa fa-fw fa-trash-o"></i></menu>');
                }
            }
        })

        .disableSelection();


    $(document)

        .on('focus', '#basics input, #vars input', function(){
            $(this).parent().addClass('notEmpty');
        })

        .on('blur', '#basics input, #vars input', function(){
            if($(this).val().trim() == 0){
                $(this).parent().removeClass('notEmpty');
            }
        });


    $('#vars .add-new')

        .on('click',function(){
            var varName = prompt('varname', '');
            if(varName && varName.trim().length > 0){
                var clone = $(this).clone();
                clone
                    .removeClass('.add-new')
                    .hide()
                    .append('<menu><i class="fa fa-fw fa-trash-o"></i></menu>');
                clone.children('label').attr('for',varName).text(varName);
                clone.children('input').attr('id',varName);
                clone.insertBefore($(this)).slideDown(200);
            }
        });


    $('#open-button')

        .on('click',function(){

            var package = {};
            
            $('#basics article').each(function(){
            
                if($(this).children('input').val().length > 0){
                    package[$(this).children('label').text()] = $(this).children('input').val();
                }
            
            });

            package.scripts = {},
            package.dependencies = {};

            $('#workflow article').each(function(){
            
                if($(this).children('input').val().length > 0){
                    package.scripts[$(this).children('label').text()] = $(this).children('input').val();
                    package.dependencies[$(this).children('label').text()] = $(this).children('input').attr('dependency');
                }
            
            });

            var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(package, null, indentSetting));

            $('#download').attr('href',data).attr('download','package.json');

        });


    $(document)
        
        .on('click','article .fa-trash-o',function(){

            var elem = $(this)
                .parents('article')
                .slideUp(200);
                
            window.setTimeout(function(){
                elem.remove();
            },300);

        });


});


(function() {

    var bodyEl = document.body,
        content = document.querySelector( '#page' ),
        openbtn = document.getElementById( 'open-button' ),
        closebtn = document.getElementById( 'close-button' ),
        isOpen = false,

        morphEl = document.getElementById( 'morph-shape' ),
        s = Snap( morphEl.querySelector( 'svg' ) );
        path = s.select( 'path' );
        initialPath = this.path.attr('d'),
        pathOpen = morphEl.getAttribute( 'data-morph-open' ),
        isAnimating = false;

    function init() {
        initEvents();
    }

    function initEvents() {
        openbtn.addEventListener( 'click', toggleMenu );
        if( closebtn ) {
            closebtn.addEventListener( 'click', toggleMenu );
        }

        content.addEventListener( 'click', function(ev) {
            var target = ev.target;
            if( isOpen && target !== openbtn ) {
                toggleMenu();
            }
        } );
    }

    function toggleMenu() {
        if( isAnimating ) return false;
        isAnimating = true;
        if( isOpen ) {
            classie.remove( bodyEl, 'show-menu' );
            setTimeout( function() {
                path.attr( 'd', initialPath );
                isAnimating = false; 
            }, 300 );
        }
        else {
            classie.add( bodyEl, 'show-menu' );
            path.animate( { 'path' : pathOpen }, 400, mina.easeinout, function() { isAnimating = false; } );
        }
        isOpen = !isOpen;
    }

    init();

})();