
 // where files are dropped + file selector is opened
   const dropRegion = document.getElementById("drop-region")
    // where images are previewed
   const imagePreviewRegion = document.getElementById("image-preview");
   // open file selector when clicked on the drop region
    let fakeInput = document.createElement("input");
    fakeInput.type = "file";
    fakeInput.accept = "image/*";
    fakeInput.multiple = true;
    dropRegion.addEventListener('click', function() {
        fakeInput.click();
    });
    fakeInput.addEventListener("change", function() {
        let files = fakeInput.files;
        handleFiles(files);
    });
    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    dropRegion.addEventListener('dragenter', preventDefault, false);
    dropRegion.addEventListener('dragleave', preventDefault, false);
    dropRegion.addEventListener('dragover', preventDefault, false);
    dropRegion.addEventListener('drop', preventDefault, false);

    function validateImage(image) {
        // check the type
        let validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (validTypes.indexOf( image.type ) === -1) {
            alert("Invalid File Type");
            return false;
        }
    
        // check the size
        let maxSizeInBytes = 10e6; // 10MB
        if (image.size > maxSizeInBytes) {
            alert("File too large");
            return false;
        }
    
        return true;
    }
    
    dropRegion.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer,
            files = dt.files;
    
        if (files.length) {
    
            handleFiles(files);
    
        } else {
    
            // check for img
            let html = dt.getData('text/html'),
                match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
                url = match && match[1];
    
    
    
            if (url) {
                uploadImageFromURL(url);
                return;
            }
    
        }
    
    
        function uploadImageFromURL(url) {
            let img = new Image;
            let c = document.createElement("canvas");
            let ctx = c.getContext("2d");
    
            img.onload = function() {
                c.width = this.naturalWidth;     // update canvas size to match image
                c.height = this.naturalHeight;
                ctx.drawImage(this, 0, 0);       // draw in image
                c.toBlob(function(blob) {        // get content as PNG blob
    
                    // call our main function
                    handleFiles( [blob] );
    
                }, "image/png");
            };
            img.onerror = function() {
                alert("Error in uploading");
            }
            img.crossOrigin = "";              // if from different origin
            img.src = url;
        }
    
    }
    function handleFiles(files) {
        for (let i = 0, len = files.length; i < len; i++) {
            if (validateImage(files[i]))
                previewAnduploadImage(files[i]);
        }
    }
    function validateImage(image) {
        // check the type
        let validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (validTypes.indexOf( image.type ) === -1) {
            alert("Invalid File Type");
            return false;
        }
    
        // check the size
        let maxSizeInBytes = 10e6; // 10MB
        if (image.size > maxSizeInBytes) {
            alert("File too large");
            return false;
        }
    
        return true;
    }

    function previewAnduploadImage(image) {

        // container
        let imgView = document.createElement("div");
        imgView.className = "image-view";
        imagePreviewRegion.appendChild(imgView);
    
        // previewing image
        let img = document.createElement("img");
        imgView.appendChild(img);
    
        // progress overlay
        let overlay = document.createElement("div");
        overlay.className = "overlay";
        imgView.appendChild(overlay);
    
    
        // read the image...
        let reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        }
        reader.readAsDataURL(image);
    
        // create FormData
        let formData = new FormData();
        formData.append('image', image);
    
        // upload the image
        let uploadLocation = 'UPLOAD_LOCATION';
    
        let xhr = new XMLHttpRequest();
        xhr.open("POST", uploadLocation, true);
    
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // done!
                    alert('Upload successful');
                } else {
                    // error!
                    
                }
            }
        }
        
        xhr.upload.onprogress = function(e) {
    
            // change progress
            // (reduce the width of overlay)
            setTimeout(() =>{
                let progress = (e.loaded / e.total * 100) || 100
                    width = 100 - progress       
                overlay.style.width = width;
                progressBar(width)
            }, 1000)
           
        }
        function progressBar(width) {
            let progress = document.querySelector('progress')
            progress.value = width
            console.log(progress.value)      
        }
            xhr.send(formData);
    
    }
    //browsers that don't support drag and drop
    function detectDragDrop() {
        let div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)
    }
  

         
