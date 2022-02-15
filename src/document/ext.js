// extension('document', function (extension) {
//     extension.action.register('save', function() {
//         console.log('Saving');
//     });
// });

export const name = 'document';

export default function(extension) {
    extension.action.register('save', function() {
        console.log('saving');
    })
}