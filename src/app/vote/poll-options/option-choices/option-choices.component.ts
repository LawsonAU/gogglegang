import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../../../shared/image-upload/image.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { memberData } from '../../../home/members.data';

@Component({
    selector: 'app-option-choices',
    templateUrl: './option-choices.component.html',
    styleUrls: ['./option-choices.component.scss']
})
export class OptionChoicesComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() imageName: string = '';
    @Input() description: string = '';
    @Input() id: string = '';
    @Input() imageURL: string = '';
    @Input() tags: string[] = [];
    @Input() option: number = 0;
    @Input() index: number = 0;

    @Output() choiceSubmitted: EventEmitter<{ imageName: string, description: string, tags: any, imageURL: string, option: number, id: string }> = new EventEmitter<{ imageName: string, description: string, tags: any, imageURL: string, option: number, id: string }>();

    memberNames = memberData.members.map(member => member.name).sort();

    choiceForm: FormGroup;
    uploadImage: boolean = false;
    isLoading: boolean = false;
    isUploading: boolean = false;

    localImageUrl: string = "";
    imageObject: any = null;
    imageArray: any = [];

    optionLocal: number = this.option;

    constructor(
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private imageService: ImageService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.initForm();
        if (this.imageURL) {
            this.localImageUrl = this.imageURL;
            this.loadImageFromFileUrl(this.imageURL);
            this.uploadImage = true;
        }
    }

    ngAfterViewInit(): void {
        this.optionLocal = this.option;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['imageName'] && this.choiceForm) {
            console.log('imageName Change: ', changes['imageName'].currentValue);
            if (!this.choiceForm.value.imageName.includes(this.imageName)) {
                this.choiceForm.patchValue({ imageName: `${this.imageName} -` });
            }
        }
    }

    initForm() {
        this.choiceForm = this.formBuilder.group({
            imageName: [this.imageName, [Validators.required, Validators.minLength(3)]],
            description: [this.description, Validators.required],
            tags: [this.tags, Validators.required],
            imageURL: this.imageURL,
        });
    }

    loadImageFromFileUrl(url: string): void {
        this.isLoading = true;
        this.http.get(url, { responseType: 'blob', observe: 'response' }).subscribe(
            (response) => {
                // Use a generic filename in case the content type is not known
                const fileName = 'file';

                // Create a File object with a generic filename
                const file = new File([response.body as Blob], fileName);

                this.imageArray.push(file);
                this.isLoading = false;
            },
            (error) => {
                console.error('Error loading image:', error);
                this.isLoading = false;
            }
        );
    }

    getFileExtensionFromContentType(contentType: string | null): string | null {
        if (!contentType) return null;
        const parts = contentType.split('/');
        return parts.length === 2 ? parts[1].toLowerCase() : null;
    }

    isAllowedExtension(extension: string): boolean {
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
        return allowedExtensions.includes(extension);
    }

    onSubmit() {
        if (this.choiceForm.valid) {
            const formData = this.choiceForm.value;
            formData.tags = formData.tags.split(',').map(tag => tag.trim());
            this.choiceSubmitted.emit(formData);
        }
    }

    handleFilesAdded(files: File[]): void {
        this.imageArray = files;
    }

    handleFilesRemoved(files: File[]) {
        this.localImageUrl = '';
        this.imageArray = [];
    }

    createImageObject() {
        if (this.choiceForm.valid) {
            const formData = new FormData();
            formData.append('file', this.imageArray[0]);
            formData.append('imageName', this.choiceForm.value.imageName);
            formData.append('description', this.choiceForm.value.description);
            formData.append('tags', this.choiceForm.value.tags.split(',').map(tag => tag.trim()));
            formData.append('voteCount', "0");
            formData.append('option', this.option.toString());

            if (this.id) {
                this.updateImage(formData, this.id)
            } else {
                this.createImage(formData)
            }
        }
    }

    createImage(formData: any): void {
        this.isUploading = true;
        this.imageService.createImage(formData).subscribe({
            next: (response) => {
                console.log('Image created successfully:', response);
                this.showSnackBar(`Image is created`, 'success');
                this.imageURL = response.imageURL;
                this.id = response.id;
                this.onFieldChange();
                this.isUploading = false;
            },
            error: (error) => {
                console.error('Error creating image:', error);
                this.showSnackBar(`Image failed to create`, 'error');
                this.isUploading = false;
            },
            complete: () => {
                // Optional: Any actions you want to perform when the observable completes
            }
        });
    }

    updateImage(formData: any, id): void {
        this.isUploading = true;
        this.imageService.updateImage(formData, id).subscribe({
            next: (response) => {
                console.log('Image updated successfully:', response);
                this.showSnackBar(`Image is updated`, 'success');
                this.imageURL = response.imageURL;
                this.onFieldChange();
                // You can perform additional actions after the image creation if needed
                this.isUploading = false;
            },
            error: (error) => {
                console.error('Error updated image:', error);
                this.showSnackBar(`Image failed to update`, 'error');
                this.isUploading = false;
            },
            complete: () => {
                // Optional: Any actions you want to perform when the observable completes
            }
        });
    }

    onFieldChange() {
        const nameValue = this.choiceForm.get('imageName').value;
        const descriptionValue = this.choiceForm.get('description').value;
        const tagValue = this.choiceForm.get('tags').value;

        this.choiceSubmitted.emit({ imageName: nameValue, description: descriptionValue, tags: tagValue, imageURL: this.imageURL, option: this.option, id: this.id });
    }

    showSnackBar(message: string, messageType: 'success' | 'warning' | 'error'): void {
        const config = new MatSnackBarConfig();
        config.duration = 3000;

        const panelClass = `custom-${messageType}-snackbar`;
        config.panelClass = [panelClass];

        this.snackBar.open(message, undefined, config);
    }
}
