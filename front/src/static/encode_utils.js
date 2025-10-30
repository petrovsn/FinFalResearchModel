class FileEncoder {
    constructor() {

    }

    get_csr_text_from_raw_filecontent(filecontent) {
        let csr_b64 = filecontent.split("data:application/octet-stream;base64,")[1]
        let csr_part_in = atob(csr_b64)
        //console.log("get_csr_text_from_raw_filecontent 1", csr_part_in)


        //csr_part_in = csr_part_in.replace("BEGIN CERTIFICATE REQEST", "")
        //csr_part_in = csr_part_in.replace("-----END CERTIFICATE REQEST-----", "")
        //csr_part_in = csr_part_in.replace('\r', '')

        //console.log("get_csr_text_from_raw_filecontent 2", csr_part_in)

        let fragments = csr_part_in.split('\n')
        console.log("get_csr_text_from_raw_filecontent 2", fragments)

        let result_text = ""
        for (let j in fragments) {
            console.log("get_csr_text_from_raw_filecontent fragment", j, fragments[j], typeof (fragments[j]), fragments[j].includes(" "))
            if (!fragments[j].includes(" "))
                result_text = result_text + fragments[j]

        }
        result_text = result_text.replace('\r', '')

        console.log("get_csr_text_from_raw_filecontent result", result_text)
        return result_text



    }
}

export const file_encoder = new FileEncoder()