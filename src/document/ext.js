extension('document', function (extension) {
    extension.actions().register('save', function() {
        console.log('Saving');
    });
});