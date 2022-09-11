import { Stream } from "stream";

export interface FaceUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream;
}
