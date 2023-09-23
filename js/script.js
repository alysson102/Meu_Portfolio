
const el = document.querySelector("#text")
const text = "DESENVOLVIMENTO WEB."
const interval = 200

function showText(el, text, interval){
    const char = text.split("").reverse()
    const typer = setInterval(() => {
        if(!char.length){
            return clearInterval(typer)
        }

        const next = char.pop()
       
        el.innerHTML += next
         
    },interval)
}


showText(el, text, interval)




const myObserver = new IntersectionObserver( (entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add('show')
        }else{
            entry.target.classList.remove('show')
        }
    })
})

const elements = document.querySelectorAll('.hidden')

elements.forEach( (element) => myObserver.observe(element))



//funções jquery

$(function(){

    //função de clik da scroll
    
    $('a.clic').click(function(){
        var tay = $(this).attr('href');
        var dust = $(tay).offset().top;

        $('html,body').animate({'scrollTop':dust});

        return false;
    })
   
    

    //função click do menu mobile

    $('.menu_mobile').click(function(){
        var listaMenu = $('.menu_mobile ul');
        //$('.menu_mobile').find('ul').slideToggle();

        if(listaMenu.is(':hidden') == true){
            var icone = $('.menu_mobile').find('i');
            icone.removeClass('fa-solid fa-bars');
            icone.addClass('fa-solid fa-xmark');
            listaMenu.slideToggle();
        }else{
            var icone = $('.menu_mobile').find('i');
            icone.removeClass('fa-solid fa-xmark');
            icone.addClass('fa-solid fa-bars');
            listaMenu.slideToggle();
        }

    });



})
