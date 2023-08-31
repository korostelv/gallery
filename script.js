$(function(){

   var array = ['photo/1.jpeg','photo/2.jpeg','photo/3.jpeg','photo/4.jpeg','photo/5.jpeg']


   // создание точек и фотографий
   for(var i=0;i<array.length;i++){
      var point = $('<div></div>');
      if (i===0){
      point.addClass('first-point');
      }
      else {
      point.addClass('point');
      }
      $('#points').append(point);
   
      var photo = $('<img src='+array[i]+'>')
      if(i!=0){
      photo.css('display','none');
      }
      $('#photo').append(photo);

   }

   var photo = $('#photo img[src*=photo]');
   var prev = $('#icons img[alt=prev]');
   var rewind = $('#icons img[alt=rewind]');
   var play = $('#icons img[alt=play]');
   var forward = $('#icons img[alt=fast-forward]');
   var next = $('#icons img[alt=next]');
   var pause = $('#icons img[alt=pause]');
   
   pause.hide();
   prev.css('opacity', 0.5);
   rewind.css('opacity', 0.5);

   // Фукция прозрачности кнопок при крайних открытых изображений
   function opacityButton() {
      var currentIndex = photo.filter(':visible').index();

      if (currentIndex === 1) {
         prev.css('opacity', 0.5);
         rewind.css('opacity', 0.5);
         forward.css('opacity', 1);
         next.css('opacity', 1);
      } else if (currentIndex === array.length) {
         prev.css('opacity', 1);
         rewind.css('opacity', 1);
         forward.css('opacity', 0.5);
         next.css('opacity', 0.5);
      } else {
         prev.css('opacity', 1);
         rewind.css('opacity', 1);
         forward.css('opacity', 1);
         next.css('opacity', 1);
      }
   }





   // Функция закрашивания точки,соответствующей открытой фотографии
   function markerPoint(){
      $('#points').children().removeClass('first-point').addClass('point');
      photo.each(function () { 
         if ($(this).css('display')=='block'){   
         var i = $(this).index();
         $('#points .point').each(function(){
            $(this).removeClass('first-point').addClass('point');
            if($(this).index()===(i-1)){
               $(this).removeClass('point').addClass('first-point');
            }
         })
         }   
      })
   }


   // Перелистывание фотографий по точкам
   $('#points').children().click(function(){
      var i = $(this).index();
      photo.each(function(){
         $(this).hide();
         if ($(this).index() === i+1){
            $(this).fadeIn(500);
         }
      })
      markerPoint();
      opacityButton();
   })

   // Перелистывание к последнему изображению
   forward.click(function(){
      if(photo.eq(array.length-1).css('display')=='none'){
         photo.each(function(){
            $(this).hide();
         })
         photo.eq(array.length-1).fadeIn(500);
      }
      markerPoint();
      opacityButton();
   })

   // Перелистывание к первому изображению
   rewind.click(function(){ 
      if(photo.eq(0).css('display')=='none'){
         photo.each(function(){
            $(this).hide();
         })
         photo.eq(0).fadeIn(500);
      }
      markerPoint();
      opacityButton()
   })

   // Перелистывание к следующему изображению
   next.click(function(){
      var i;
      photo.each(function(){
         if(photo.eq(array.length-1).css('display') == 'block'){
            return
         };
         if ($(this).css('display')=='block'){
            i = $(this).index();
            $(this).hide();      
         }
         if($(this).index()===(i+1)){
            $(this).fadeIn(500)
         }
      })
      markerPoint();
      opacityButton()
   })


   // Перелистывание к предыдущему изображению
   prev.click(function() {
      var currentPhoto = photo.filter(':visible');
      if (currentPhoto.index() === 1) {
         return;
      }
      currentPhoto.hide();
      currentPhoto.prev('img').fadeIn(500);
      markerPoint();
      opacityButton()
   });

   // Открытие и закрытие большого изображения
   $('.maximize').click(function(){
      var currentPhoto = photo.filter(':visible');
      var src = currentPhoto.attr('src');
      var image_container = $('<div></div>');
      image_container.addClass('image_container');
      $('#container').append(image_container);

      var big_foto = $('<img>');
      big_foto.attr('src',src).addClass('big');
      image_container.append(big_foto);

      var minimize = $('<img>');
      minimize.attr('src','icons/minimize.png').addClass('minimize');
      image_container.append(minimize);
      image_container.fadeIn(500)

      $('.minimize').click(function(){
         $('.image_container').fadeOut(500, function() {
            $('.image_container').remove(); 
         });
      });
      
   })

   // Слайд-шоу
   play.click(function() {
      var currentIndex = 0;
      play.hide();
      pause.show();
      next.css('pointer-events','none')   //блокировка остальных кнопок при слайд-шоу
      forward.css('pointer-events','none')
      rewind.css('pointer-events','none')
      prev.css('pointer-events','none')
      if(photo.eq(0).css('display')=='none'){  //переход на первое изображение
         photo.each(function(){
            $(this).hide();
         })
         photo.eq(0).fadeIn(500);
         markerPoint();
         opacityButton()
      }
      function showNextPhoto() {
         if(photo.eq(array.length-1).css('display') == 'block'){ //при достижение последнего изображения остановка слайд-шоу и переход на первое изображени
            pause.hide();
            play.show();
            photo.eq(array.length-1).hide();
            photo.eq(0).show();
            next.css('pointer-events','auto') //разблокирока кнопок по окончании
            forward.css('pointer-events','auto')
            rewind.css('pointer-events','auto')
            prev.css('pointer-events','auto')
            return
         };
         
         photo.eq(currentIndex).fadeOut(500, function() {   //непосредственно перелистывание изображений
            currentIndex = (currentIndex + 1);
            photo.eq(currentIndex).fadeIn(500);
            markerPoint();
            opacityButton()
         });
         
     
      }
   
   var slide = setInterval(showNextPhoto,2000)
   // Отключение слайд-шоу
   pause.click(function(){
      clearInterval(slide)
      photo.each(function(){
         $(this).hide();
      })
      photo.eq(0).fadeIn(500); //при остановке слайдов возврат на первое изображение
      pause.hide();
      play.show();
      next.css('pointer-events','auto')   //разблокирока кнопок
      forward.css('pointer-events','auto')
      rewind.css('pointer-events','auto')
      prev.css('pointer-events','auto')
      markerPoint();
      opacityButton()
   })
      
   });
 




})
