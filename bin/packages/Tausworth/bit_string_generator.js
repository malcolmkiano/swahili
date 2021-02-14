const bit_string_generator = function bit_string_generator(q, r, total_no_of_bits){
    let init_sequence = [];
    for (let i = 0; i<q; i++){
        if (Math.random() > 0.5) {
            init_sequence[i] = 1;
        }else{
            init_sequence = 0;
        }
    }

    let initial_bits = init_sequence;
    for(let i=q; i<total_no_of_bits+1; i++){
        initial_bits[i] = (initial_bits[i-r] + initial_bits[i-q])%2;
    }
    return initial_bits;
}

export default bit_string_generator;