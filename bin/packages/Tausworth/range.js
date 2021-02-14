import bit_string_generator from "./bit_string_generator";

let total_no_of_bits = 48;
let bit_string = bit_string_generator(3, 6, total_no_of_bits)

const range = function rand_in_range(min, max){
    bit_string = bit_string.join('');
    this.max = max;
    this.min = min;
    let l = total_no_of_bits +1;
    let numerator = parseInt(bit_string, 2);
    let random_number = numerator / Math.pow(2, l);
    random_number = min + random_number * (max-min);

    return random_number;
}

export default range;