import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnChanges {
    @Input() currentFiles: File[] = [];
    @Input() maxFiles: number = Number.MAX_SAFE_INTEGER;
    @Input() disabled: boolean = false;

    @Output() filesAdded: EventEmitter<File[]> = new EventEmitter<File[]>();
    @Output() filesRemoved: EventEmitter<File[]> = new EventEmitter<File[]>();

    files: File[] = [];

    constructor(
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        if (this.currentFiles) {
            this.updateFilesArray();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentFiles'] && !changes['currentFiles'].isFirstChange()) {
            //this.updateFilesArray();
        }
    }

    onSelect(event: any): void {
        if (this.files.length + event.addedFiles.length > this.maxFiles) {
            this.showSnackBar(`Cannot add more than ${this.maxFiles} files.`, 'warning');
            return;
        }

        const validFiles: File[] = [];

        for (const file of event.addedFiles) {
            if (this.isFileTypeValid(file) && this.isFileSizeValid(file)) {
                validFiles.push(file);
            } else {
                const errorMessage = this.isFileTypeValid(file)
                    ? 'File size exceeds the limit (5MB).'
                    : 'Invalid file type. Allowed types: JPG, PNG, GIF, WebP.';

                this.showSnackBar(`Error adding file '${file.name}': ${errorMessage}`, 'error');
            }
        }

        this.files.push(...validFiles);
        this.files.length = this.maxFiles;

        this.filesAdded.emit(this.files);
    }

    removeFile(file: File): void {
        const removedFiles: File[] = [file];
        this.files = this.files.filter(f => f !== file);
        this.filesRemoved.emit(removedFiles);
    }

    private isFileTypeValid(file: File): boolean {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        return allowedTypes.includes(file.type);
    }

    private isFileSizeValid(file: File): boolean {
        const maxSizeInBytes = 5 * 1024 * 1024;
        return file.size <= maxSizeInBytes;
    }

    private updateFilesArray(): void {
        this.files = this.currentFiles;
    }

    showSnackBar(message: string, messageType: 'success' | 'warning' | 'error'): void {
        const config = new MatSnackBarConfig();
        config.duration = 3000;

        const panelClass = `custom-${messageType}-snackbar`;
        config.panelClass = [panelClass];

        this.snackBar.open(message, undefined, config);
    }
}
