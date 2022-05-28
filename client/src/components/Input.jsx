const Input = ({ placeholder, name, handleChange, type, value }) => (
    <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={(e) => handleChange(e, name)}
        step={'0.0001'}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);

export default Input;
