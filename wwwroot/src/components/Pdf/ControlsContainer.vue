<template>
    <section class="control-container">
        <h3 class="control-header">
            Component Props Controls
        </h3>

        <button
            :disabled="isGenerating"
            class="generate-btn"
            @click="$emit('generateReport')"
        >
            {{ isGenerating ? 'Loading...' : 'Generate PDF' }}
        </button>

        <section class="progress-container">
            <div class="progress-bar">
                <div
                    class="progress"
                    :style="`width: ${progress}%;`"
                />
            </div>

            <section class="generating-label" v-if="progress !== 0">
                <span class="label-title">
                    {{ progress === 100 ? 'PDF Generated' : 'Generating PDF' }}
                </span>

                <span class="label-progress">
                    {{ `${ progress } %` }}
                </span>
            </section>
        </section>
    </section>
</template>

<script>

export default {
    props: {
        progress: {
            type: Number,
            default: 0
        }
    },

    data () {
        return {
            controls: [
				{
					label: 'show-layout:',
					type: 'Boolean',
                    options: 'true, false',
                    inputType: 'checkbox',
                    vModel: 'showLayout'
                },

                {
					label: 'preview-in-newtab:',
					type: 'Boolean',
                    options: 'true, false',
                    inputType: 'checkbox',
                    vModel: 'previewInNewtab'
                },
                
                {
					label: 'paginate-elements-by-height:',
					type: 'Number',
                    options: 'Any Number',
                    inputType: 'number',
                    vModel: 'paginateElementsByHeight'
                },
                
                {
					label: 'filename:',
					type: 'String',
                    options: 'Any String',
                    inputType: 'text',
                    vModel: 'filename'
                },
                
                {
					label: 'pdf-quality:',
					type: 'Number',
                    options: '0 - 2 (Can Have Decimal)',
                    inputType: 'number',
                    vModel: 'pdfQuality'
                },
                {
					label: 'pdf-format:',
					type: 'String',
                    options: 'a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10',
                    inputType: 'text',
                    vModel: 'pdfFormat'
				},
            ],
        }
    },

    computed: {
        isGenerating () {
            return this.progress !== 0 && this.progress !== 100
        }
    },

    methods: {
        setInput (e, key, inputType) {
            let value = e.target.value

            if (inputType === 'checkbox') {
                value = e.target.checked
            }

            if (inputType === 'number') {
                value = e.target.value
                            ? parseFloat(e.target.value)
                            : 0
            }

            this.$set(this.controlValue, key, value)
        }
    },
}
</script>

<style lang="scss" scoped>
.control-container {
    position: fixed;
    z-index: 999999;
    padding: 15px;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 5px;
    right: 25px;
    top: 25px;
    width: 405px;
    box-shadow: 5px 5px 10px #000000;
    opacity: 0;
    max-height: calc(100vh - 50px);

    .control-header {
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 1px solid #ccc;
    }


    .generate-btn {
        border: 0;
        padding: 15px 25px;
        border-radius: 5px;
        color: #fff;
        background: #2c3e50;
        transition: 0.3s;
        text-align: center;
        cursor: pointer;
        position: sticky;

        &:disabled {
            opacity: 0.5;
        }
    }

    .progress-container {
        width: 100%;
        margin-top: 25px;

        .progress-bar {
            width: 100%;
            height: 10px;
            border: 1px solid #585858;
            border-radius: 5px;
            margin-bottom: 5px;

            .progress {
                width: 0%;
                height: 100%;
                transition: 0.3s;
                background: #2c3e50;
            }
        }

        .generating-label {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>