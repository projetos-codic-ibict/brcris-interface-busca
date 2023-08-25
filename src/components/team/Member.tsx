import { MemberType } from '../../types/Entities';

const Member = ({ name, image, lattes }: MemberType) => {
  return (
    <div className="team-member">
      <picture className="d-flex justify-content-center">
        <img src={image} alt={`foto de ${name}`} />
      </picture>
      <h2>{name}</h2>
      <p>
        <a href={lattes} target="_blank" rel="noreferrer">
          CV Lattes
        </a>
      </p>
    </div>
  );
};

export default Member;
