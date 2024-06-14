import { useRef } from 'react'

import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr'


type MarkdownEditorProps = {
  disabled?: boolean
  initialValue?: string
  onChangeHandler: (value: string) => void
}

const MarkdownEditor = ({ disabled, initialValue, onChangeHandler }: MarkdownEditorProps) => {
  const ref = useRef<Editor>(null)

  return (
    <div className='relative'>
      {disabled && (
        <div className='w-full h-full absolute top-0 left-0 bg-black opacity-50 z-30' />
      )}
        <Editor
          autofocus={false}
          initialValue={initialValue}
          previewStyle="vertical"
          height="300px"
          initialEditType="wysiwyg"
          toolbarItems={[
            ['heading', 'bold', 'italic', 'strike'],
            ['hr', 'quote'],
            ['ul', 'ol', 'task'],
            ['table', 'link'],
            ['code', 'codeblock']
          ]}
          language="ko-KR"
          useCommandShortcut={true}
          hideModeSwitch
          ref={ref}
          onChange={() => {
            if (disabled) {
              return
            }
            onChangeHandler(ref.current?.getInstance().getMarkdown() || '')
          }}
        />
    </div>
  );
};

export default MarkdownEditor;
