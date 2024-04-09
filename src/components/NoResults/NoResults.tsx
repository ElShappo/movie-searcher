type NoResultsProps = {
  text?: string;
};

const NoResults = ({ text }: NoResultsProps) => {
  if (text) {
    return <div>{text}</div>;
  }
  return <div>Ничего не нашлось :(</div>;
};

export default NoResults;
