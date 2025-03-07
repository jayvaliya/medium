// import React from 'react';
// import { Editor } from '@tiptap/react';
// import {
//     Bold,
//     Italic,
//     List,
//     ListOrdered,
//     AlignLeft,
//     AlignCenter,
//     AlignRight,
//     Heading1,
//     Heading2,
//     Code,
//     Link,
//     Image,
//     Undo,
//     Redo,
//     Quote,
// } from 'lucide-react';

// interface MenuBarProps {
//     editor: Editor | null;
// }

// const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
//     if (!editor) {
//         return null;
//     }

//     const addImage = () => {
//         const url = window.prompt('Enter image URL:');
//         if (url) {
//             editor.chain().focus().setImage({ src: url }).run();
//         }
//     };

//     const addLink = () => {
//         const url = window.prompt('Enter URL:');
//         if (url) {
//             editor.chain().focus().setLink({ href: url }).run();
//         }
//     };

//     return (
//         <div className="border-b border-gray-200 bg-white p-2 sticky top-0 z-10 flex flex-wrap gap-2">
//             {/* Text Style Controls */}
//             <button
//                 onClick={() => editor.chain().focus().toggleBold().run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''
//                     }`}
//                 title="Bold"
//             >
//                 <Bold size={20} />
//             </button>

//             <button
//                 onClick={() => editor.chain().focus().toggleItalic().run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''
//                     }`}
//                 title="Italic"
//             >
//                 <Italic size={20} />
//             </button>

//             <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//             {/* Heading Controls */}
//             <button
//                 onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
//                     }`}
//                 title="Heading 1"
//             >
//                 <Heading1 size={20} />
//             </button>

//             <button
//                 onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
//                     }`}
//                 title="Heading 2"
//             >
//                 <Heading2 size={20} />
//             </button>

//             <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//             {/* List Controls */}
//             <button
//                 onClick={() => editor.chain().focus().toggleBulletList().run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''
//                     }`}
//                 title="Bullet List"
//             >
//                 <List size={20} />
//             </button>

//             <button
//                 onClick={() => editor.chain().focus().toggleOrderedList().run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''
//                     }`}
//                 title="Numbered List"
//             >
//                 <ListOrdered size={20} />
//             </button>

//             <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//             {/* Alignment Controls */}
//             <button
//                 onClick={() => editor.chain().focus().setTextAlign('left').run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
//                     }`}
//                 title="Align Left"
//             >
//                 <AlignLeft size={20} />
//             </button>

//             <button
//                 onClick={() => editor.chain().focus().setTextAlign('center').run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
//                     }`}
//                 title="Align Center"
//             >
//                 <AlignCenter size={20} />
//             </button>

//             <button
//                 onClick={() => editor.chain().focus().setTextAlign('right').run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
//                     }`}
//                 title="Align Right"
//             >
//                 <AlignRight size={20} />
//             </button>

//             <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//             {/* Special Controls */}
//             <button
//                 onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('codeBlock') ? 'bg-gray-200' : ''
//                     }`}
//                 title="Code Block"
//             >
//                 <Code size={20} />
//             </button>

//             <button
//                 onClick={() => editor.chain().focus().toggleBlockquote().run()}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''
//                     }`}
//                 title="Quote"
//             >
//                 <Quote size={20} />
//             </button>

//             <button
//                 onClick={addLink}
//                 className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''
//                     }`}
//                 title="Add Link"
//             >
//                 <Link size={20} />
//             </button>

//             <button
//                 onClick={addImage}
//                 className="p-2 rounded hover:bg-gray-100"
//                 title="Add Image"
//             >
//                 <Image size={20} />
//             </button>

//             <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

//             {/* Undo/Redo */}
//             <button
//                 onClick={() => editor.chain().focus().undo().run()}
//                 disabled={!editor.can().undo()}
//                 className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
//                 title="Undo"
//             >
//                 <Undo size={20} />
//             </button>

//             <button
//                 onClick={() => editor.chain().focus().redo().run()}
//                 disabled={!editor.can().redo()}
//                 className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
//                 title="Redo"
//             >
//                 <Redo size={20} />
//             </button>
//         </div>
//     );
// };

// export default MenuBar;