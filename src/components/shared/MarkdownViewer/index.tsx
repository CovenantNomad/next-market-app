import { Viewer } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'

type MarkdownViewerProps = {
  value: string
}

const MarkdownViewer = ({ value }: MarkdownViewerProps) => {
  return (
    <div className='tui--large'>
      <Viewer 
        initialValue={value} 
      />
    </div>
  )
};

export default MarkdownViewer;
