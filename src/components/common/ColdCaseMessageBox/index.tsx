
type ColdCaseMessageBoxProps = {
  message: string
}

const ColdCaseMessageBox = ({ message }: ColdCaseMessageBoxProps) => {
  return (
    <div className='pt-20 pb-10 flex justify-center items-center'>
      <span className="text-gray-500">{message}</span>
    </div>
  );
};

export default ColdCaseMessageBox;
