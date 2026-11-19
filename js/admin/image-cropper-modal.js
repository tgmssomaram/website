// image-cropper-modal.js — Universal Interactive Image Cropper for TGMS Admin
// Provides full aspect ratio presets (Free, 1:1, 4:3, 16:9, 3:4, 2:3), 90° rotation, horizontal flipping, zooming, and high-quality canvas export.

(function() {
  'use strict';

  window.AdminCropper = {
    /**
     * Opens interactive crop modal for a given image file.
     * @param {File|Blob} file - The original image file
     * @param {Object} options - Optional configuration { title, defaultAspect, maxWidth, maxHeight }
     * @returns {Promise<File|null>} - Resolves with cropped File, or null if cancelled
     */
    crop: function(file, options) {
      options = options || {};
      var self = this;

      return new Promise(function(resolve) {
        if (!file || !(file instanceof Blob)) {
          console.warn('AdminCropper: Invalid file passed');
          return resolve(file);
        }

        var fileName = file.name || 'image.jpg';
        var fileType = file.type || 'image/jpeg';
        var defaultAspect = options.defaultAspect || 'free';
        var title = options.title || '✂️ Crop & Adjust Photo';

        var reader = new FileReader();
        reader.onerror = function() {
          console.error('AdminCropper: Failed to read file');
          resolve(file);
        };

        reader.onload = function(e) {
          var imageSrc = e.target.result;
          self._showModal(imageSrc, fileName, fileType, defaultAspect, title, file, resolve);
        };

        reader.readAsDataURL(file);
      });
    },

    _showModal: function(imageSrc, fileName, fileType, defaultAspect, title, originalFile, resolve) {
      // Remove any existing modal
      var existing = document.getElementById('admin-cropper-modal');
      if (existing) existing.remove();

      var backdrop = document.createElement('div');
      backdrop.id = 'admin-cropper-modal';
      backdrop.className = 'cropper-modal-backdrop';

      backdrop.innerHTML = '\
        <div class="cropper-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cropper-dialog-title">\
          <div class="cropper-modal-header">\
            <div>\
              <h3 id="cropper-dialog-title" class="cropper-modal-title">' + title + '</h3>\
              <p class="cropper-modal-subtitle">Choose aspect ratio, rotate, or drag the frame to adjust photo boundaries.</p>\
            </div>\
            <button type="button" class="cropper-modal-close" id="cropper-close-btn" aria-label="Close crop modal">&times;</button>\
          </div>\
          \
          <div class="cropper-modal-body">\
            <!-- STAGE / IMAGE CONTAINER -->\
            <div class="cropper-stage-wrap">\
              <img id="cropper-target-img" src="' + imageSrc + '" alt="Crop target" />\
            </div>\
            \
            <!-- ASPECT RATIO PRESETS -->\
            <div class="cropper-toolbar-group">\
              <div class="cropper-toolbar-label">\
                <span>Aspect Ratio Presets</span>\
                <span id="cropper-aspect-label" style="text-transform:none;color:#0f766e;font-weight:700;"></span>\
              </div>\
              <div class="cropper-pills" id="cropper-aspect-pills">\
                <button type="button" class="cropper-pill-btn" data-ratio="free">Free / Custom</button>\
                <button type="button" class="cropper-pill-btn" data-ratio="1:1">1:1 Square (Passport/Profile)</button>\
                <button type="button" class="cropper-pill-btn" data-ratio="4:3">4:3 Standard</button>\
                <button type="button" class="cropper-pill-btn" data-ratio="16:9">16:9 Landscape (Campus/Activity)</button>\
                <button type="button" class="cropper-pill-btn" data-ratio="3:4">3:4 Portrait</button>\
                <button type="button" class="cropper-pill-btn" data-ratio="2:3">2:3 Tall Portrait</button>\
              </div>\
            </div>\
            \
            <!-- ROTATE & ADJUST CONTROLS -->\
            <div class="cropper-toolbar-group">\
              <div class="cropper-toolbar-label">\
                <span>Rotate & Framing Controls</span>\
              </div>\
              <div class="cropper-action-btns">\
                <button type="button" class="cropper-tool-btn" id="crop-rotate-left" title="Rotate 90 degrees counter-clockwise">⟲ Rotate -90°</button>\
                <button type="button" class="cropper-tool-btn" id="crop-rotate-right" title="Rotate 90 degrees clockwise">⟳ Rotate +90°</button>\
                <button type="button" class="cropper-tool-btn" id="crop-flip-h" title="Flip horizontally">⇄ Flip H</button>\
                <button type="button" class="cropper-tool-btn" id="crop-zoom-in" title="Zoom in">🔍+ Zoom In</button>\
                <button type="button" class="cropper-tool-btn" id="crop-zoom-out" title="Zoom out">🔍− Zoom Out</button>\
                <button type="button" class="cropper-tool-btn" id="crop-reset" title="Reset all adjustments">↺ Reset</button>\
              </div>\
            </div>\
          </div>\
          \
          <div class="cropper-modal-footer">\
            <div class="cropper-info-chip" id="cropper-dim-info">Target: Loading image...</div>\
            <div class="cropper-footer-actions">\
              <button type="button" class="cropper-btn-cancel" id="cropper-cancel-btn">Cancel</button>\
              <button type="button" class="cropper-btn-skip" id="cropper-skip-btn" title="Upload without cropping">Skip (Use Original)</button>\
              <button type="button" class="cropper-btn-apply" id="cropper-apply-btn">✓ Crop & Done</button>\
            </div>\
          </div>\
        </div>';

      document.body.appendChild(backdrop);

      var imgEl = document.getElementById('cropper-target-img');
      var dimInfo = document.getElementById('cropper-dim-info');
      var aspectLabel = document.getElementById('cropper-aspect-label');
      var cropperInstance = null;
      var scaleX = 1;

      // Calculate initial aspect ratio
      var initialRatio = NaN;
      if (defaultAspect === '1:1') initialRatio = 1;
      else if (defaultAspect === '4:3') initialRatio = 4 / 3;
      else if (defaultAspect === '16:9') initialRatio = 16 / 9;
      else if (defaultAspect === '3:4') initialRatio = 3 / 4;
      else if (defaultAspect === '2:3') initialRatio = 2 / 3;

      function updateActivePill(ratioKey) {
        document.querySelectorAll('#cropper-aspect-pills .cropper-pill-btn').forEach(function(btn) {
          if (btn.dataset.ratio === ratioKey) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        aspectLabel.textContent = ratioKey === 'free' ? 'Custom Box' : ratioKey;
      }

      function initCropper() {
        if (typeof Cropper === 'undefined') {
          console.error('Cropper.js library is not loaded');
          dimInfo.textContent = 'Cropper library loading error';
          return;
        }

        cropperInstance = new Cropper(imgEl, {
          aspectRatio: initialRatio,
          viewMode: 1, // restrict crop box to size of image
          autoCropArea: 0.95,
          responsive: true,
          restore: false,
          guides: true,
          center: true,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: false,
          crop: function(e) {
            var data = e.detail;
            dimInfo.textContent = 'Crop Area: ' + Math.round(data.width) + ' × ' + Math.round(data.height) + ' px';
          }
        });

        updateActivePill(defaultAspect);
      }

      // Check if image loaded
      if (imgEl.complete) {
        initCropper();
      } else {
        imgEl.onload = initCropper;
      }

      // Aspect Ratio Click Handlers
      document.querySelectorAll('#cropper-aspect-pills .cropper-pill-btn').forEach(function(btn) {
        btn.onclick = function() {
          var ratioKey = btn.dataset.ratio;
          var numRatio = NaN;
          if (ratioKey === '1:1') numRatio = 1;
          else if (ratioKey === '4:3') numRatio = 4 / 3;
          else if (ratioKey === '16:9') numRatio = 16 / 9;
          else if (ratioKey === '3:4') numRatio = 3 / 4;
          else if (ratioKey === '2:3') numRatio = 2 / 3;

          if (cropperInstance) {
            cropperInstance.setAspectRatio(numRatio);
          }
          updateActivePill(ratioKey);
        };
      });

      // Rotate & Framing Actions
      document.getElementById('crop-rotate-left').onclick = function() {
        if (cropperInstance) cropperInstance.rotate(-90);
      };

      document.getElementById('crop-rotate-right').onclick = function() {
        if (cropperInstance) cropperInstance.rotate(90);
      };

      document.getElementById('crop-flip-h').onclick = function() {
        if (cropperInstance) {
          scaleX = -scaleX;
          cropperInstance.scaleX(scaleX);
        }
      };

      document.getElementById('crop-zoom-in').onclick = function() {
        if (cropperInstance) cropperInstance.zoom(0.1);
      };

      document.getElementById('crop-zoom-out').onclick = function() {
        if (cropperInstance) cropperInstance.zoom(-0.1);
      };

      document.getElementById('crop-reset').onclick = function() {
        if (cropperInstance) {
          scaleX = 1;
          cropperInstance.reset();
        }
      };

      // Close / Cancel Helper
      function closeCropperModal(result) {
        if (cropperInstance) {
          cropperInstance.destroy();
          cropperInstance = null;
        }
        backdrop.remove();
        document.removeEventListener('keydown', handleKey);
        resolve(result);
      }

      function handleKey(e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeCropperModal(null);
        }
      }
      document.addEventListener('keydown', handleKey);

      document.getElementById('cropper-close-btn').onclick = function() {
        closeCropperModal(null);
      };

      document.getElementById('cropper-cancel-btn').onclick = function() {
        closeCropperModal(null);
      };

      document.getElementById('cropper-skip-btn').onclick = function() {
        closeCropperModal(originalFile);
      };

      // Backdrop click outside modal
      backdrop.onclick = function(e) {
        if (e.target === backdrop) closeCropperModal(null);
      };

      // Apply Crop & Export
      document.getElementById('cropper-apply-btn').onclick = function() {
        if (!cropperInstance) {
          return closeCropperModal(originalFile);
        }

        var applyBtn = document.getElementById('cropper-apply-btn');
        applyBtn.disabled = true;
        applyBtn.textContent = '⏳ Processing...';

        var canvas = cropperInstance.getCroppedCanvas({
          maxWidth: 2048,
          maxHeight: 2048,
          fillColor: '#ffffff',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        });

        if (!canvas) {
          console.warn('AdminCropper: Canvas creation failed, using original file');
          return closeCropperModal(originalFile);
        }

        // Export to Blob
        var exportType = fileType === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(function(blob) {
          if (!blob) {
            console.warn('AdminCropper: Blob conversion failed, using original file');
            return closeCropperModal(originalFile);
          }

          // Build File instance from Blob
          var croppedFile;
          try {
            croppedFile = new File([blob], fileName, {
              type: exportType,
              lastModified: Date.now()
            });
          } catch (e) {
            // Safari / older browser fallback
            croppedFile = blob;
            croppedFile.name = fileName;
            croppedFile.lastModifiedDate = new Date();
          }

          closeCropperModal(croppedFile);
        }, exportType, 0.92);
      };
    }
  };
})();
