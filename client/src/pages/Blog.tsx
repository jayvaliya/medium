import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import axios from 'axios';

interface BlogData {
  title: string;
  content: string;
  // Add other blog properties as needed
}

export default function Blog() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsedContent, setParsedContent] = useState<OutputData | null>(null);
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);

  // Try to parse the blog content
  const tryParseContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      // Validate that it's an EditorJS data structure
      if (parsed && parsed.blocks) {
        return parsed as OutputData;
      }
      return null;
    } catch (e) {
      console.log('Content parsing failed:', e);
      return null;
    }
  };

  // Fetch blog data
  useEffect(() => {
    const url = `http://localhost:8787/api/v1/blog/${id}`;

    axios
      .get(url)
      .then((response) => {
        setBlog(response.data.blog);
        const parsed = tryParseContent(response.data.blog.content);
        setParsedContent(parsed);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response ? error.response.data : "Error fetching blog data");
        setLoading(false);
      });
  }, [id]);

  // Initialize EditorJS
  useEffect(() => {
    if (!holderRef.current || !parsedContent || editorRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      tools: {
        header: {
          // @ts-expect-error Header is not a valid type
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4],
            defaultLevel: 2
          },
          inlineToolbar: false
        },
        list: {
          // @ts-expect-error Header is not a valid type
          class: List,
          inlineToolbar: false
        },
        paragraph: {
          // @ts-expect-error Header is not a valid type
          class: Paragraph,
          inlineToolbar: false
        }
      },
      data: parsedContent,
      readOnly: true,
      onReady: () => {
        console.log('Editor is ready');
      }
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
          editorRef.current = null;
        } catch (e) {
          console.error('Error destroying editor:', e);
        }
      }
    };
  }, [parsedContent]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <article>
        <header className="mx-auto max-w-screen-lg rounded-t-lg pt-16 text-center relative">
          <h1 className="mt-2 text-4xl px-5 font-bold sm:text-5xl relative z-10">
            {blog.title}
          </h1>
        </header>

        <div className="mx-auto max-w-screen-lg rounded-b-lg px-10 pt-10 pb-20">
          {parsedContent ? (
            <div ref={holderRef} className="prose max-w-none" />
          ) : (
            <div className="font-serif text-lg tracking-wide text-gray-700">
              <p className="whitespace-pre-wrap">{blog.content}</p>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}