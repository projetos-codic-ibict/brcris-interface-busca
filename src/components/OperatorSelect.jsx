export default function OperatorSelect({ config }) {
  return (
    <select
      id="operator"
      onChange={(e) => {
        config.searchQuery.operator = e.target.value
      }}
    >
      <option value="AND">AND</option>
      <option value="OR">OR</option>
    </select>
  )
}
