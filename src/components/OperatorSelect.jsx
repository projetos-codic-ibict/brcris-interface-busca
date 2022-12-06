export default function OperatorSelect({ config }) {
  return (
    <div className="d-flex mt-2 align-items-center">
      <label htmlFor="operator">
        <h6 className="card-title text-h6 me-2">
          Operador de busca:{' '}
        </h6>
      </label>
      <select
        id="operator"
        onChange={(e) => {
          config.searchQuery.operator = e.target.value
        }}
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>
    </div> 
  )
}
